"=============================================================================
" FILE: installer.vim
" AUTHOR:  Shougo Matsushita <Shougo.Matsu at gmail.com>
" Last Modified: 10 Mar 2014.
" License: MIT license  {{{
"     Permission is hereby granted, free of charge, to any person obtaining
"     a copy of this software and associated documentation files (the
"     "Software"), to deal in the Software without restriction, including
"     without limitation the rights to use, copy, modify, merge, publish,
"     distribute, sublicense, and/or sell copies of the Software, and to
"     permit persons to whom the Software is furnished to do so, subject to
"     the following conditions:
"
"     The above copyright notice and this permission notice shall be included
"     in all copies or substantial portions of the Software.
"
"     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
"     OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
"     MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
"     IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
"     CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
"     TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
"     SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
" }}}
" Version: 0.1, for Vim 7.2
"=============================================================================

let s:save_cpo = &cpo
set cpo&vim

let s:install_info_version = '3.0'

let s:log = []
let s:updates_log = []

function! neobundle#installer#update(bundles)
  if neobundle#util#is_sudo()
    call neobundle#util#print_error(
          \ '"sudo vim" is detected. This feature is disabled.')
    return
  endif

  call neobundle#commands#helptags(
        \ neobundle#config#get_neobundles())
  call s:reload(filter(copy(a:bundles),
        \ 'v:val.sourced && !v:val.disabled'))

  call s:save_install_info(neobundle#config#get_neobundles())

  if !empty(a:bundles)
    call s:update_ftdetect()
  endif
endfunction

function! neobundle#installer#build(bundle)
  " Environment check.
  let build = get(a:bundle, 'build', {})
  if neobundle#util#is_windows() && has_key(build, 'windows')
    let cmd = build.windows
  elseif neobundle#util#is_mac() && has_key(build, 'mac')
    let cmd = build.mac
  elseif neobundle#util#is_cygwin() && has_key(build, 'cygwin')
    let cmd = build.cygwin
  elseif !neobundle#util#is_windows() && has_key(build, 'unix')
    let cmd = build.unix
  elseif has_key(build, 'others')
    let cmd = build.others
  else
    return
  endif

  call neobundle#installer#log('[neobundle/install] Building...')

  let cwd = getcwd()
  try
    if isdirectory(a:bundle.path)
      call neobundle#util#cd(a:bundle.path)
    endif

    let result = neobundle#util#system(cmd)
  catch
    " Build error from vimproc.
    let message = (v:exception !~# '^Vim:')?
          \ v:exception : v:exception . ' ' . v:throwpoint
    call neobundle#installer#error(message)

    return 1
  finally
    if isdirectory(cwd)
      call neobundle#util#cd(cwd)
    endif
  endtry

  if neobundle#util#get_last_status()
    call neobundle#installer#error(result)
  else
    call neobundle#installer#log('[neobundle/install] ' . result)
  endif

  return neobundle#util#get_last_status()
endfunction

function! neobundle#installer#reinstall(bundles)
  for bundle in a:bundles
    " Reinstall.
    call neobundle#installer#log(
          \ printf('[neobundle/install] |%s| Reinstalling...', bundle.name))

    " Save info.
    let arg = copy(bundle.orig_arg)

    " Remove.
    call neobundle#commands#clean(1, bundle.name)

    call call('neobundle#parser#bundle', [arg])
  endfor

  " Install.
  call neobundle#commands#install(0,
        \ join(map(copy(a:bundles), 'v:val.name')))

  call neobundle#installer#update(a:bundles)
endfunction

function! neobundle#installer#get_reinstall_bundles(bundles)
  let reinstall_bundles = filter(copy(a:bundles),
        \ "neobundle#config#is_installed(v:val.name)
        \  && v:val.normalized_name !=# 'neobundle' &&
        \     v:val.normalized_name !=# 'unite'
        \  && v:val.type !=# 'nosync'
        \  && !v:val.local &&
        \     v:val.path ==# v:val.installed_path &&
        \     v:val.uri !=# v:val.installed_uri")
  if !empty(reinstall_bundles)
    echomsg 'Reinstall bundles detected: '
          \ string(map(copy(reinstall_bundles), 'v:val.name'))
    let ret = confirm('Reinstall bundles now?', "yes\nNo", 2)
    redraw
    if ret != 1
      return []
    endif
  endif

  return reinstall_bundles
endfunction

function! neobundle#installer#get_sync_command(bang, bundle, number, max)
  let type = neobundle#config#get_types(a:bundle.type)
  if empty(type)
    return ['', printf('(%'.len(a:max).'d/%d): |%s| %s',
          \ a:number, a:max, a:bundle.name, 'Unknown Type')]
  endif

  let is_directory = isdirectory(a:bundle.path)

  let cmd = type.get_sync_command(a:bundle)

  if cmd == ''
    return ['', 'Not supported sync action.']
  elseif (is_directory && !a:bang)
    return ['', 'Already installed.']
  endif

  let message = printf('(%'.len(a:max).'d/%d): |%s| %s',
        \ a:number, a:max, a:bundle.name, cmd)

  return [cmd, message]
endfunction

function! neobundle#installer#get_revision_lock_command(bang, bundle, number, max)
  let repo_dir = neobundle#util#substitute_path_separator(
        \ neobundle#util#expand(a:bundle.path.'/.'.a:bundle.type.'/'))

  let type = neobundle#config#get_types(a:bundle.type)
  if empty(type)
    return ['', printf('(%'.len(a:max).'d/%d): |%s| %s',
          \ a:number, a:max, a:bundle.name, 'Unknown Type')]
  endif

  let cmd = type.get_revision_lock_command(a:bundle)

  if cmd == ''
    return ['', '']
  endif

  let message = printf('(%'.len(a:max).'d/%d): |%s| %s',
        \ a:number, a:max, a:bundle.name, cmd)

  return [cmd, message]
endfunction

function! neobundle#installer#get_revision_number(bundle)
  let cwd = getcwd()
  try
    let type = neobundle#config#get_types(a:bundle.type)

    if !isdirectory(a:bundle.path)
      return ''
    endif

    call neobundle#util#cd(a:bundle.path)

    return neobundle#util#system(
          \ type.get_revision_number_command(a:bundle))
  finally
    if isdirectory(cwd)
      call neobundle#util#cd(cwd)
    endif
  endtry

  return ''
endfunction

function! s:get_commit_date(bundle)
  let cwd = getcwd()
  try
    let type = neobundle#config#get_types(a:bundle.type)

    if !isdirectory(a:bundle.path) ||
          \ !has_key(type, 'get_commit_date_command')
      return 0
    endif

    call neobundle#util#cd(a:bundle.path)

    return neobundle#util#system(
          \ type.get_commit_date_command(a:bundle))
  finally
    if isdirectory(cwd)
      call neobundle#util#cd(cwd)
    endif
  endtry

  return ''
endfunction

function! neobundle#installer#get_updated_log_message(bundle, new_rev, old_rev)
  let cwd = getcwd()
  try
    let type = neobundle#config#get_types(a:bundle.type)

    if isdirectory(a:bundle.path)
      call neobundle#util#cd(a:bundle.path)
    endif

    let log_command = has_key(type, 'get_log_command') ?
          \ type.get_log_command(a:bundle, a:new_rev, a:old_rev) : ''
    let log = (log_command != '' ?
          \ neobundle#util#system(log_command) : '')
    return log != '' ? log : printf('%s -> %s', a:old_rev, a:new_rev)
  finally
    if isdirectory(cwd)
      call neobundle#util#cd(cwd)
    endif
  endtry
endfunction

function! neobundle#installer#sync(bundle, context, is_unite)
  let a:context.source__number += 1

  let num = a:context.source__number
  let max = a:context.source__max_bundles

  let before_one_day = localtime() - 60 * 60 * 24
  let before_one_week = localtime() - 60 * 60 * 24 * 7

  if a:context.source__bang == 1 &&
        \ a:bundle.stay_same
    let [cmd, message] = ['', 'has "stay_same" attribute.']
  elseif a:context.source__bang == 1 &&
        \ a:bundle.uri ==# a:bundle.installed_uri &&
        \ a:bundle.updated_time < before_one_week
        \     && a:bundle.checked_time >= before_one_day
    let [cmd, message] = ['', 'Outdated plugin.']
  else
    let [cmd, message] =
          \ neobundle#installer#get_sync_command(
          \ a:context.source__bang, a:bundle,
          \ a:context.source__number, a:context.source__max_bundles)
  endif

  if cmd == ''
    " Skipped.
    call neobundle#installer#log(s:get_skipped_message(
          \ num, max, a:bundle, '[neobundle/install]', message), a:is_unite)
    return
  elseif cmd =~# '^E: '
    " Errored.

    call neobundle#installer#log(
          \ printf('[neobundle/install] (%'.len(max).'d/%d): |%s| %s',
          \ num, max, a:bundle.name, 'Error'), a:is_unite)
    call neobundle#installer#error(cmd[3:], a:is_unite)
    call add(a:context.source__errored_bundles,
          \ a:bundle)
    return
  endif

  call neobundle#installer#log(
        \ '[neobundle/install] ' . message, a:is_unite)

  let cwd = getcwd()
  try
    if isdirectory(a:bundle.path)
      " Cd to bundle path.
      call neobundle#util#cd(a:bundle.path)
    endif

    let rev = neobundle#installer#get_revision_number(a:bundle)

    let process = {
          \ 'number' : num,
          \ 'rev' : rev,
          \ 'bundle' : a:bundle,
          \ 'output' : '',
          \ 'status' : -1,
          \ 'eof' : 0,
          \ 'start_time' : localtime(),
          \ }
    if neobundle#util#has_vimproc()
      let process.proc = vimproc#pgroup_open(vimproc#util#iconv(
            \            cmd, &encoding, 'char'), 0, 2)

      " Close handles.
      call process.proc.stdin.close()
      call process.proc.stderr.close()
    else
      let process.output = neobundle#util#system(cmd)
      let process.status = neobundle#util#get_last_status()
    endif
  finally
    if isdirectory(cwd)
      call neobundle#util#cd(cwd)
    endif
  endtry

  call add(a:context.source__processes, process)
endfunction

function! neobundle#installer#check_output(context, process, is_unite)
  if neobundle#util#has_vimproc() && has_key(a:process, 'proc')
    let is_timeout = (localtime() - a:process.start_time)
          \             >= g:neobundle#install_process_timeout
    let a:process.output .= vimproc#util#iconv(
          \ a:process.proc.stdout.read(-1, 300), 'char', &encoding)
    if !a:process.proc.stdout.eof && !is_timeout
      return
    endif
    call a:process.proc.stdout.close()

    let [_, status] = a:process.proc.waitpid()
  else
    let is_timeout = 0
    let status = a:process.status
  endif

  let num = a:process.number
  let max = a:context.source__max_bundles
  let bundle = a:process.bundle

  " Lock revision.
  call neobundle#installer#lock_revision(
        \ a:process, a:context, a:is_unite)

  let cwd = getcwd()

  let rev = neobundle#installer#get_revision_number(bundle)

  let updated_time = s:get_commit_date(bundle)
  let bundle.checked_time = localtime()

  if is_timeout
        \ || (status && a:process.rev ==# rev
        \     && (bundle.type !=# 'git' ||
        \     a:process.output !~# 'up-to-date\|up to date'))
    let message = printf('[neobundle/install] (%'.len(max).'d/%d): |%s| %s',
          \ num, max, bundle.name, 'Error')
    call neobundle#installer#log(message, a:is_unite)
    call neobundle#installer#error(bundle.path, a:is_unite)
    call neobundle#installer#error(
          \ (is_timeout ? 'Process timeout.' :
          \    split(a:process.output, '\n')), a:is_unite)
    call add(a:context.source__errored_bundles,
          \ bundle)
  elseif a:process.rev ==# rev
    if updated_time != 0
      let bundle.updated_time = updated_time
    endif

    call neobundle#installer#log(s:get_skipped_message(
          \ num, max, bundle, '[neobundle/install]',
          \ 'Same revision.'), a:is_unite)
  else
    call neobundle#installer#update_log(
          \ printf('[neobundle/install] (%'.len(max).'d/%d): |%s| %s',
          \ num, max, bundle.name, 'Updated'), a:is_unite)
    let message = neobundle#installer#get_updated_log_message(
          \ bundle, rev, a:process.rev)
    call neobundle#installer#update_log(
          \ map(split(message, '\n'),
          \ "printf('[neobundle/install] |%s| ' .
          \   substitute(v:val, '%', '%%', 'g'), bundle.name)"),
          \ a:is_unite)

    if updated_time == 0
      let updated_time = bundle.checked_time
    endif
    let bundle.updated_time = updated_time
    let bundle.installed_uri = bundle.uri
    let bundle.revisions[updated_time] = rev

    call neobundle#installer#build(bundle)
    call add(a:context.source__synced_bundles,
          \ bundle)
  endif

  let a:process.eof = 1
endfunction

function! neobundle#installer#lock_revision(process, context, is_unite)
  let num = a:process.number
  let max = a:context.source__max_bundles
  let bundle = a:process.bundle

  if bundle.rev == ''
    " Skipped.
    return 0
  endif

  let bundle.new_rev = neobundle#installer#get_revision_number(bundle)

  let [cmd, message] =
        \ neobundle#installer#get_revision_lock_command(
        \ a:context.source__bang, bundle, num, max)

  if cmd == ''
    " Skipped.
    return 0
  elseif cmd =~# '^E: '
    " Errored.
    call neobundle#installer#error(bundle.path, a:is_unite)
    call neobundle#installer#error(cmd[3:], a:is_unite)
    return -1
  endif

  call neobundle#installer#log(
        \ printf('[neobundle/install] (%'.len(max).'d/%d): |%s| %s',
        \ num, max, bundle.name, 'Locked'), a:is_unite)

  call neobundle#installer#log(
        \ '[neobundle/install] ' . message, a:is_unite)

  let cwd = getcwd()
  try
    if isdirectory(bundle.path)
      " Cd to bundle path.
      call neobundle#util#cd(bundle.path)
    endif

    let result = neobundle#util#system(cmd)
    let status = neobundle#util#get_last_status()
  finally
    if isdirectory(cwd)
      call neobundle#util#cd(cwd)
    endif
  endtry

  if status
    call neobundle#installer#error(bundle.path, a:is_unite)
    call neobundle#installer#error(result, a:is_unite)
    return -1
  endif
endfunction

function! s:update_ftdetect()
  " Delete old files.
  call neobundle#util#cleandir('ftdetect')
  call neobundle#util#cleandir('after/ftdetect')
endfunction

function! s:save_install_info(bundles)
  let s:install_info = {}
  for bundle in filter(copy(a:bundles),
        \ "!v:val.local && has_key(v:val, 'updated_time')")
    " Note: Don't save local repository.
    let s:install_info[bundle.name] = {
          \   'checked_time' : bundle.checked_time,
          \   'updated_time' : bundle.updated_time,
          \   'installed_uri' : bundle.installed_uri,
          \   'installed_path' : bundle.path,
          \   'revisions' : bundle.revisions,
          \ }
  endfor

  call neobundle#util#writefile('install_info',
        \ [s:install_info_version, string(s:install_info)])
endfunction

function! neobundle#installer#_load_install_info(bundles)
  let install_info_path =
        \ neobundle#get_neobundle_dir() . '/.neobundle/install_info'
  if !exists('s:install_info')
    let s:install_info = {}

    if filereadable(install_info_path)
      try
        let list = readfile(install_info_path)
        let ver = list[0]
        sandbox let s:install_info = eval(list[1])
        if ver !=# s:install_info_version
              \ || type(s:install_info) != type({})
          let s:install_info = {}
        endif
      catch
      endtry
    endif
  endif

  call map(a:bundles, "extend(v:val, get(s:install_info, v:val.name, {
        \ 'checked_time' : localtime(),
        \ 'updated_time' : localtime(),
        \ 'installed_uri' : v:val.uri,
        \ 'installed_path' : v:val.path,
        \ 'revisions' : {},
        \}))")

  return s:install_info
endfunction

function! s:get_skipped_message(number, max, bundle, prefix, message)
  let messages = [a:prefix . printf(' (%'.len(a:max).'d/%d): |%s| %s',
          \ a:number, a:max, a:bundle.name, 'Skipped')]
  if a:message != ''
    call add(messages, a:prefix . ' ' . a:message)
  endif
  return messages
endfunction

function! neobundle#installer#log(msg, ...)
  let is_unite = get(a:000, 0, 0)
  let msg = type(a:msg) == type([]) ?
        \ a:msg : split(a:msg, '\n')
  call extend(s:log, msg)

  if !(&filetype == 'unite' || is_unite)
    call neobundle#util#redraw_echo(msg)
  endif

  call s:append_log_file(msg)
endfunction

function! neobundle#installer#update_log(msg, ...)
  let msgs = []
  for msg in type(a:msg) == type([]) ?
        \ a:msg : [a:msg]
    let source_name = matchstr(msg, '^\[.\{-}\] ')

    let msg_nrs = split(msg, '\n')
    let msgs += [msg_nrs[0]] +
          \ map(msg_nrs[1:], "source_name . v:val")
  endfor

  call call('neobundle#installer#log', [msgs] + a:000)

  let s:updates_log += msgs
endfunction

function! neobundle#installer#error(msg, ...)
  let is_unite = get(a:000, 0, 0)
  let msg = type(a:msg) == type([]) ?
        \ a:msg : split(a:msg, '\r\?\n')
  call extend(s:log, msg)
  call extend(s:updates_log, msg)

  if &filetype == 'unite' || is_unite
    call unite#print_error(msg)
  else
    call neobundle#util#print_error(msg)
  endif

  call s:append_log_file(msg)
endfunction

function! s:append_log_file(msg)
  if g:neobundle#log_filename == ''
    return
  endif

  let msg = a:msg
  " Appends to log file.
  if filereadable(g:neobundle#log_filename)
    let msg = readfile(g:neobundle#log_filename) + msg
  endif
  call writefile(msg, g:neobundle#log_filename)
endfunction

function! neobundle#installer#get_log()
  return s:log
endfunction

function! neobundle#installer#get_updates_log()
  return s:updates_log
endfunction

function! neobundle#installer#clear_log()
  let s:log = []
  let s:updates_log = []
endfunction

function! neobundle#installer#get_tags_info()
  let path = neobundle#get_neobundle_dir() . '/.neobundle/tags_info'
  if !filereadable(path)
    return []
  endif

  return readfile(path)
endfunction

function! s:reload(bundles) "{{{
  if empty(a:bundles)
    return
  endif

  call filter(copy(a:bundles), 'neobundle#config#rtp_add(v:val)')

  " Call hooks.
  call neobundle#call_hook('on_source', a:bundles)

  silent! runtime! ftdetect/**/*.vim
  silent! runtime! after/ftdetect/**/*.vim
  silent! runtime! plugin/**/*.vim
  silent! runtime! after/plugin/**/*.vim

  " Call hooks.
  call neobundle#call_hook('on_post_source', a:bundles)
endfunction"}}}

function! s:redir(cmd) "{{{
  redir => res
  silent! execute a:cmd
  redir END
  return res
endfunction"}}}

let &cpo = s:save_cpo
unlet s:save_cpo
