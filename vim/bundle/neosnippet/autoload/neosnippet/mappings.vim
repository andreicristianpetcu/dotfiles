"=============================================================================
" FILE: mappings.vim
" AUTHOR:  Shougo Matsushita <Shougo.Matsu@gmail.com>
" Last Modified: 26 Nov 2013.
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
"=============================================================================

let s:save_cpo = &cpo
set cpo&vim

function! neosnippet#mappings#expandable_or_jumpable() "{{{
  return neosnippet#mappings#expandable() || neosnippet#mappings#jumpable()
endfunction"}}}
function! neosnippet#mappings#expandable() "{{{
  " Check snippet trigger.
  return neosnippet#helpers#get_cursor_snippet(
        \ neosnippet#helpers#get_snippets(), neosnippet#util#get_cur_text()) != ''
endfunction"}}}
function! neosnippet#mappings#jumpable() "{{{
  " Found snippet placeholder.
  return search(neosnippet#get_placeholder_marker_pattern(). '\|'
            \ .neosnippet#get_sync_placeholder_marker_pattern(), 'nw') > 0
endfunction"}}}

function! neosnippet#mappings#_clear_select_mode_mappings() "{{{
  if !g:neosnippet#disable_select_mode_mappings
    return
  endif

  redir => mappings
    silent! smap
  redir END

  for line in map(filter(split(mappings, '\n'),
        \ "v:val !~# '^s'"),
        \ "substitute(v:val, '<NL>', '<C-J>', 'g')")
    let map = matchstr(line, '^\a*\s*\zs\S\+')
    let map = substitute(map, '<NL>', '<C-j>', 'g')

    silent! execute 'sunmap' map
    silent! execute 'sunmap <buffer>' map
  endfor

  " Define default select mode mappings.
  snoremap <CR>     a<BS>
  snoremap <BS>     a<BS>
  snoremap <Del>    a<BS>
  snoremap <C-h>    a<BS>
endfunction"}}}

function! neosnippet#mappings#_register_oneshot_snippet() "{{{
  let trigger = input('Please input snippet trigger: ', 'oneshot')
  if trigger == ''
    return
  endif

  let selected_text = substitute(
        \ neosnippet#helpers#get_selected_text(visualmode(), 1), '\n$', '', '')
  call neosnippet#helpers#delete_selected_text(visualmode(), 1)

  let base_indent = matchstr(selected_text, '^\s*')

  " Delete base_indent.
  let selected_text = substitute(selected_text,
        \'^' . base_indent, '', 'g')

  let neosnippet = neosnippet#variables#current_neosnippet()
  let options = neosnippet#parser#_initialize_snippet_options()
  let options.word = 1

  let neosnippet.snippets[trigger] = neosnippet#parser#_initialize_snippet(
        \ { 'name' : trigger, 'word' : selected_text, 'options' : options },
        \ '', 0, '', trigger)

  echo 'Registered trigger : ' . trigger
endfunction"}}}

function! neosnippet#mappings#_expand_target() "{{{
  let trigger = input('Please input snippet trigger: ',
        \ '', 'customlist,neosnippet#commands#_complete_target_snippets')
  let neosnippet = neosnippet#variables#current_neosnippet()
  if !has_key(neosnippet#helpers#get_snippets(), trigger) ||
        \ neosnippet#helpers#get_snippets()[trigger].snip !~#
        \   neosnippet#get_placeholder_target_marker_pattern()
    if trigger != ''
      echo 'The trigger is invalid.'
    endif

    let neosnippet.target = ''
    return
  endif

  call neosnippet#mappings#_expand_target_trigger(trigger)
endfunction"}}}
function! neosnippet#mappings#_expand_target_trigger(trigger) "{{{
  let neosnippet = neosnippet#variables#current_neosnippet()
  let neosnippet.target = substitute(
        \ neosnippet#helpers#get_selected_text(visualmode(), 1), '\n$', '', '')

  let line = getpos("'<")[1]
  let col = getpos("'<")[2]

  call neosnippet#helpers#delete_selected_text(visualmode())

  call cursor(line, col)

  call neosnippet#view#_expand(neosnippet#util#get_cur_text(), col, a:trigger)
endfunction"}}}

function! s:snippets_expand(cur_text, col) "{{{
  let cur_word = neosnippet#helpers#get_cursor_snippet(
        \ neosnippet#helpers#get_snippets(),
        \ a:cur_text)

  call neosnippet#view#_expand(
        \ a:cur_text, a:col, cur_word)
endfunction"}}}

function! s:snippets_expand_or_jump(cur_text, col) "{{{
  let cur_word = neosnippet#helpers#get_cursor_snippet(
        \ neosnippet#helpers#get_snippets(), a:cur_text)

  if cur_word != ''
    " Found snippet trigger.
    call neosnippet#view#_expand(
          \ a:cur_text, a:col, cur_word)
  else
    call neosnippet#view#_jump(a:cur_text, a:col)
  endif
endfunction"}}}

function! s:snippets_jump_or_expand(cur_text, col) "{{{
  let cur_word = neosnippet#helpers#get_cursor_snippet(
        \ neosnippet#helpers#get_snippets(), a:cur_text)
  if search(neosnippet#get_placeholder_marker_pattern(). '\|'
            \ .neosnippet#get_sync_placeholder_marker_pattern(), 'nw') > 0
    " Found snippet placeholder.
    call neosnippet#view#_jump(a:cur_text, a:col)
  else
    call neosnippet#view#_expand(
          \ a:cur_text, a:col, cur_word)
  endif
endfunction"}}}

function! s:SID_PREFIX() "{{{
  return matchstr(expand('<sfile>'), '<SNR>\d\+_\ze\w\+$')
endfunction"}}}

function! s:trigger(function) "{{{
  call neosnippet#init#check()

  let cur_text = neosnippet#util#get_cur_text()

  let col = col('.')
  let expr = ''
  if mode() !=# 'i'
    " Fix column.
    let col += 2
  endif

  " Get selected text.
  let neosnippet = neosnippet#variables#current_neosnippet()
  let neosnippet.trigger = 1
  if mode() ==# 's' && neosnippet.selected_text =~ '^#:'
    let expr .= "\<C-o>\"_d"
  endif

  let expr .= printf("\<ESC>:call %s(%s,%d)\<CR>",
        \ a:function, string(cur_text), col)

  return expr
endfunction"}}}

" Plugin key-mappings.
function! neosnippet#mappings#expand_or_jump_impl()
  return s:trigger(s:SID_PREFIX().'snippets_expand_or_jump')
endfunction
function! neosnippet#mappings#jump_or_expand_impl()
  return s:trigger(s:SID_PREFIX().'snippets_jump_or_expand')
endfunction
function! neosnippet#mappings#expand_impl()
  return s:trigger(s:SID_PREFIX().'snippets_expand')
endfunction
function! neosnippet#mappings#jump_impl()
  return s:trigger('neosnippet#view#_jump')
endfunction

let &cpo = s:save_cpo
unlet s:save_cpo

" vim: foldmethod=marker
