"=============================================================================
" FILE: commands.vim
" AUTHOR:  Shougo Matsushita <Shougo.Matsu at gmail.com>
" Last Modified: 17 Mar 2014.
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
" Version: 3.0, for Vim 7.2
"=============================================================================

let s:save_cpo = &cpo
set cpo&vim

call neobundle#util#set_default(
      \ 'g:neobundle#rm_command',
      \ (neobundle#util#is_windows() ? 'rmdir /S /Q' : 'rm -rf'),
      \ 'g:neobundle_rm_command')

function! neobundle#commands#install(bang, bundle_names) "{{{
  if neobundle#util#is_sudo()
    call neobundle#util#print_error(
          \ '"sudo vim" is detected. This feature is disabled.')
    return
  endif

  let bundle_dir = neobundle#get_neobundle_dir()
  if !isdirectory(bundle_dir)
    call mkdir(bundle_dir, 'p')
  endif

  let bundle_names = split(a:bundle_names)

  let bundles = !a:bang ?
        \ neobundle#get_not_installed_bundles(bundle_names) :
        \ empty(bundle_names) ?
        \ neobundle#config#get_neobundles() :
        \ neobundle#config#fuzzy_search(bundle_names)
  if empty(bundles)
    call neobundle#installer#error(
          \ '[neobundle/install] Target bundles not found.')
    call neobundle#installer#error(
          \ '[neobundle/install] You may have used the wrong bundle name,'.
          \ ' or all of the bundles are already installed.')
    return
  endif

  call sort(bundles, 's:cmp_vimproc')

  call neobundle#installer#_load_install_info(bundles)

  call neobundle#installer#clear_log()

  call neobundle#installer#error(
        \ '[neobundle/install] Update started: ' .
        \     strftime('(%Y/%m/%d %H:%M:%S)'))

  let reinstall_bundles =
        \ neobundle#installer#get_reinstall_bundles(bundles)
  if !empty(reinstall_bundles)
    call neobundle#installer#reinstall(reinstall_bundles)
  endif

  let more_save = &more
  try
    setlocal nomore
    let [installed, errored] = s:install(a:bang, bundles)
    if !has('vim_starting')
      redraw!
    endif

    call neobundle#installer#update(installed)

    call neobundle#installer#log(
          \ "[neobundle/install] Installed/Updated bundles:\n".
          \ join((empty(installed) ?
          \   ['no new bundles installed'] :
          \   map(copy(installed), 'v:val.name')),"\n"))

    if !empty(errored)
      call neobundle#installer#log(
            \ "[neobundle/install] Error installing bundles:\n".join(
            \ map(copy(errored), 'v:val.name')), "\n")
      call neobundle#installer#log(
            \ 'Please read the error message log with the :message command.')
    endif
  finally
    let &more = more_save
  endtry
endfunction"}}}

function! neobundle#commands#helptags(bundles) "{{{
  if neobundle#util#is_sudo()
    call neobundle#util#print_error(
          \ '"sudo vim" is detected. This feature is disabled.')
    return
  endif

  let help_dirs = filter(copy(a:bundles), 's:has_doc(v:val.rtp)')

  if !empty(help_dirs)
    call s:update_tags()

    if !has('vim_starting')
      call neobundle#installer#log(
            \ '[neobundle/install] Helptags: done. '
            \ .len(help_dirs).' bundles processed')
    endif
  endif

  return help_dirs
endfunction"}}}

function! neobundle#commands#check() "{{{
  if neobundle#installer#get_tags_info() !=#
        \ sort(map(neobundle#config#get_neobundles(), 'v:val.name'))
    " Recache automatically.
    NeoBundleDocs
  endif

  if !neobundle#exists_not_installed_bundles()
    return
  endif

  if has('gui_running') && has('vim_starting')
    " Note: :NeoBundleCheck cannot work in GUI startup.
    autocmd neobundle VimEnter * NeoBundleCheck
  else
    echomsg 'Not installed bundles: '
          \ string(neobundle#get_not_installed_bundle_names())
    if confirm('Install bundles now?', "yes\nNo", 2) == 1
      call neobundle#commands#install(0, '')
    endif
    echo ''
  endif
endfunction"}}}

function! neobundle#commands#check_update(bundle_names) "{{{
  let bundle_names = split(a:bundle_names)

  " Set context.
  let context = {}
  let context.source__updated_bundles = []
  let context.source__processes = []
  let context.source__number = 0
  let context.source__bundles = empty(bundle_names) ?
        \ neobundle#config#get_neobundles() :
        \ neobundle#config#fuzzy_search(bundle_names)
  let context.source__max_bundles =
        \ len(context.source__bundles)
  while 1
    while context.source__number < context.source__max_bundles
          \ && len(context.source__processes) <
          \      g:neobundle#install_max_processes

      call s:check_update_init(
            \ context.source__bundles[context.source__number],
            \ context, 0)
    endwhile

    for process in context.source__processes
      call s:check_update_process(context, process, 0)
    endfor

    " Filter eof processes.
    call filter(context.source__processes, '!v:val.eof')

    if empty(context.source__processes)
          \ && context.source__number == context.source__max_bundles
      break
    endif
  endwhile

  let more_save = &more
  try
    setlocal nomore
    let bundles = map(context.source__updated_bundles, 'v:val.name')
    redraw!

    if !empty(bundles)
      echomsg 'Updates available bundles: '
            \ string(bundles)

      if confirm('Update bundles now?', "yes\nNo", 2) == 1
        call neobundle#commands#install(1, join(bundles))
      endif
    endif
  finally
    let &more = more_save
  endtry
endfunction"}}}

function! neobundle#commands#clean(bang, ...) "{{{
  if neobundle#util#is_sudo()
    call neobundle#util#print_error(
          \ '"sudo vim" is detected. This feature is disabled.')
    return
  endif

  if get(a:000, 0, '') == ''
    let all_dirs = filter(split(neobundle#util#substitute_path_separator(
          \ globpath(neobundle#get_neobundle_dir(), '*', 1)), "\n"),
          \ 'isdirectory(v:val)')
    let bundle_dirs = map(copy(neobundle#config#get_neobundles()),
          \ "(v:val.script_type != '') ?
          \  v:val.base . '/' . v:val.directory : v:val.path")
    let x_dirs = filter(all_dirs,
          \ "!neobundle#config#is_installed(fnamemodify(v:val, ':t'))
          \ && index(bundle_dirs, v:val) < 0 && v:val !~ '/neobundle.vim$'")
  else
    let x_dirs = map(neobundle#config#search_simple(a:000), 'v:val.path')
    if len(x_dirs) > len(a:000)
      " Check bug.
      call neobundle#util#print_error('Bug: x_dirs = %s but arguments is %s',
            \ string(x_dirs), map(copy(a:000), 'v:val.path'))
      return
    endif
  endif

  if empty(x_dirs)
    call neobundle#installer#log('[neobundle/install] All clean!')
    return
  end

  if a:bang || s:check_really_clean(x_dirs)
    if !has('vim_starting')
      redraw
    endif
    let result = neobundle#util#system(g:neobundle#rm_command . ' ' .
          \ join(map(copy(x_dirs), '"\"" . v:val . "\""'), ' '))
    if neobundle#util#get_last_status()
      call neobundle#installer#error(result)
    endif

    for dir in x_dirs
      call neobundle#config#rm(dir)
    endfor

    call s:update_tags()
  endif
endfunction"}}}

function! neobundle#commands#reinstall(bundle_names) "{{{
  let bundles = neobundle#config#search_simple(split(a:bundle_names))

  if empty(bundles)
    call neobundle#installer#error(
          \ '[neobundle/install] Target bundles not found.')
    call neobundle#installer#error(
          \ '[neobundle/install] You may have used the wrong bundle name.')
    return
  endif

  call neobundle#installer#reinstall(bundles)
endfunction"}}}

function! neobundle#commands#gc(bundle_names) "{{{
  let bundle_names = split(a:bundle_names)
  let number = 0
  let bundles = empty(bundle_names) ?
        \ neobundle#config#get_neobundles() :
        \ neobundle#config#search_simple(bundle_names)
  let max = len(bundles)
  for bundle in bundles

    let number += 1

    let type = neobundle#config#get_types(bundle.type)
    if empty(type) || !has_key(type, 'get_gc_command')
      continue
    endif

    let cmd = type.get_gc_command(bundle)

    let cwd = getcwd()
    try
      if isdirectory(bundle.path)
        " Cd to bundle path.
        call neobundle#util#cd(bundle.path)
      endif

      redraw
      call neobundle#util#redraw_echo(
            \ printf('(%'.len(max).'d/%d): |%s| %s',
            \ number, max, bundle.name, cmd))
      let result = neobundle#util#system(cmd)
      redraw
      call neobundle#util#redraw_echo(result)
      let status = neobundle#util#get_last_status()
    finally
      if isdirectory(cwd)
        call neobundle#util#cd(cwd)
      endif
    endtry

    if status
      call neobundle#installer#error(bundle.path, 0)
      call neobundle#installer#error(result, 0)
    endif
  endfor
endfunction"}}}

function! neobundle#commands#list() "{{{
  for bundle in neobundle#config#get_neobundles()
    echo (neobundle#is_sourced(bundle.name) ? ' ' :
          \ neobundle#is_installed(bundle.name) ? '#' : 'X')
          \ . ' ' . bundle.name
  endfor
endfunction"}}}

function! neobundle#commands#complete_bundles(arglead, cmdline, cursorpos) "{{{
  return filter(map(neobundle#config#get_neobundles(), 'v:val.name'),
        \ 'stridx(tolower(v:val), tolower(a:arglead)) >= 0')
endfunction"}}}

function! neobundle#commands#complete_lazy_bundles(arglead, cmdline, cursorpos) "{{{
  return filter(map(filter(neobundle#config#get_neobundles(),
        \ "!neobundle#config#is_sourced(v:val.name) && v:val.rtp != ''"), 'v:val.name'),
        \ 'stridx(tolower(v:val), tolower(a:arglead)) == 0')
endfunction"}}}

function! neobundle#commands#complete_deleted_bundles(arglead, cmdline, cursorpos) "{{{
  let bundle_dirs = map(copy(neobundle#config#get_neobundles()), 'v:val.path')
  let all_dirs = split(neobundle#util#substitute_path_separator(
        \ globpath(neobundle#get_neobundle_dir(), '*', 1)), "\n")
  let x_dirs = filter(all_dirs, 'index(bundle_dirs, v:val) < 0')

  return filter(map(x_dirs, "fnamemodify(v:val, ':t')"),
        \ 'stridx(v:val, a:arglead) == 0')
endfunction"}}}

function! s:install(bang, bundles) "{{{
  " Set context.
  let context = {}
  let context.source__bang = a:bang
  let context.source__synced_bundles = []
  let context.source__errored_bundles = []
  let context.source__processes = []
  let context.source__number = 0
  let context.source__bundles = a:bundles
  let context.source__max_bundles =
        \ len(context.source__bundles)

  while 1
    while context.source__number < context.source__max_bundles
          \ && len(context.source__processes) <
          \      g:neobundle#install_max_processes

      call neobundle#installer#sync(
            \ context.source__bundles[context.source__number],
            \ context, 0)
    endwhile

    for process in context.source__processes
      call neobundle#installer#check_output(context, process, 0)
    endfor

    " Filter eof processes.
    call filter(context.source__processes, '!v:val.eof')

    if empty(context.source__processes)
          \ && context.source__number == context.source__max_bundles
      break
    endif
  endwhile

  return [context.source__synced_bundles,
        \ context.source__errored_bundles]
endfunction"}}}

function! s:check_update_init(bundle, context, is_unite) "{{{
  let a:context.source__number += 1

  let num = a:context.source__number
  let max = a:context.source__max_bundles

  let type = neobundle#config#get_types(a:bundle.type)
  let cmd = has_key(type, 'get_revision_remote_command') ?
        \ type.get_revision_remote_command(a:bundle) : ''
  if cmd == ''
    return
  endif

  let message = printf('(%'.len(max).'d/%d): |%s| %s',
        \ num, max, a:bundle.name, cmd)

  call neobundle#installer#log(
        \ '[neobundle/check] ' . message, a:is_unite)

  let cwd = getcwd()
  try
    if isdirectory(a:bundle.path)
      " Cd to bundle path.
      call neobundle#util#cd(a:bundle.path)
    endif

    let rev = neobundle#installer#get_revision_number(a:bundle)

    let process = {
          \ 'number' : num,
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
      " call process.proc.stderr.close()
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
endfunction "}}}

function! s:check_update_process(context, process, is_unite) "{{{
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

  let remote_rev = matchstr(a:process.output, '^\S\+')

  let rev = neobundle#installer#get_revision_number(bundle)

  if is_timeout || status
    let message = printf('[neobundle/install] (%'.len(max).'d/%d): |%s| %s',
          \ num, max, bundle.name, 'Error')
    call neobundle#installer#log(message, a:is_unite)
    call neobundle#installer#error(bundle.path, a:is_unite)
    call neobundle#installer#error(
          \ (is_timeout ? 'Process timeout.' :
          \    split(a:process.output, '\n')), a:is_unite)
  elseif remote_rev != '' && remote_rev !=# rev
    call add(a:context.source__updated_bundles,
          \ bundle)
  endif

  let a:process.eof = 1
endfunction"}}}

function! s:check_really_clean(dirs) "{{{
  echo join(a:dirs, "\n")

  return input('Are you sure you want to remove '
        \        .len(a:dirs).' bundles? [y/n] : ') =~? 'y'
endfunction"}}}

function! s:update_tags() "{{{
  let bundles = [{ 'rtp' : neobundle#get_runtime_dir()}]
        \ + neobundle#config#get_neobundles()
  call s:copy_bundle_files(bundles, 'doc')

  call neobundle#util#writefile('tags_info',
        \ sort(map(neobundle#config#get_neobundles(), 'v:val.name')))

  try
    execute 'helptags' fnameescape(neobundle#get_tags_dir())
  catch
    call neobundle#installer#error('Error generating helptags:')
    call neobundle#installer#error(v:exception)
  endtry
endfunction"}}}

function! s:copy_bundle_files(bundles, directory) "{{{
  " Delete old files.
  call neobundle#util#cleandir(a:directory)

  let files = {}
  for bundle in a:bundles
    for file in filter(split(globpath(
          \ bundle.rtp, a:directory.'/*', 1), '\n'),
          \ '!isdirectory(v:val)')
      let filename = fnamemodify(file, ':t')
      let files[filename] = readfile(file)
    endfor
  endfor

  for [filename, list] in items(files)
    if filename =~# '^tags\%(-.*\)\?$'
      call sort(list)
    endif
    call neobundle#util#writefile(a:directory . '/' . filename, list)
  endfor
endfunction"}}}

function! s:has_doc(path) "{{{
  return a:path != '' &&
        \ isdirectory(a:path.'/doc')
        \   && (!filereadable(a:path.'/doc/tags')
        \       || filewritable(a:path.'/doc/tags'))
        \   && (!filereadable(a:path.'/doc/tags-??')
        \       || filewritable(a:path.'/doc/tags-??'))
        \   && (glob(a:path.'/doc/*.txt') != ''
        \       || glob(a:path.'/doc/*.??x') != '')
endfunction"}}}

" Vimproc is first.
function! s:cmp_vimproc(a, b) "{{{
  return !(a:a.name ==# 'vimproc' || a:a.name ==# 'vimproc.vim')
endfunction"}}}


let &cpo = s:save_cpo
unlet s:save_cpo
