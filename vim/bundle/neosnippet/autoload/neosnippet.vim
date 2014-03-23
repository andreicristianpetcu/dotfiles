"=============================================================================
" FILE: neosnippet.vim
" AUTHOR:  Shougo Matsushita <Shougo.Matsu@gmail.com>
" Last Modified: 11 Mar 2014.
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

" Global options definition. "{{{
call neosnippet#util#set_default(
      \ 'g:neosnippet#disable_runtime_snippets', {})
call neosnippet#util#set_default(
      \ 'g:neosnippet#scope_aliases', {})
call neosnippet#util#set_default(
      \ 'g:neosnippet#snippets_directory', '')
call neosnippet#util#set_default(
      \ 'g:neosnippet#disable_select_mode_mappings', 1)
call neosnippet#util#set_default(
      \ 'g:neosnippet#enable_snipmate_compatibility', 0)
call neosnippet#util#set_default(
      \ 'g:neosnippet#expand_word_boundary', 0)
"}}}

function! neosnippet#expandable_or_jumpable() "{{{
  return neosnippet#mappings#expandable_or_jumpable()
endfunction"}}}
function! neosnippet#expandable() "{{{
  return neosnippet#mappings#expandable()
endfunction"}}}
function! neosnippet#jumpable() "{{{
  return neosnippet#mappings#jumpable()
endfunction"}}}

function! neosnippet#get_snippets_directory() "{{{
  return neosnippet#helpers#get_snippets_directory()
endfunction"}}}
function! neosnippet#get_user_snippets_directory() "{{{
  return copy(neosnippet#variables#snippets_dir())
endfunction"}}}
function! neosnippet#get_runtime_snippets_directory() "{{{
  return copy(neosnippet#variables#runtime_dir())
endfunction"}}}

" Get marker patterns.
function! neosnippet#get_placeholder_target_marker_pattern() "{{{
  return '\${\d\+:TARGET\%(:.\{-}\)\?\\\@<!}'
endfunction"}}}
function! neosnippet#get_placeholder_marker_pattern() "{{{
  return '<`\d\+\%(:.\{-}\)\?\\\@<!`>'
endfunction"}}}
function! neosnippet#get_placeholder_marker_substitute_pattern() "{{{
  return '\${\(\d\+\%(:.\{-}\)\?\\\@<!\)}'
endfunction"}}}
function! neosnippet#get_placeholder_marker_default_pattern() "{{{
  return '<`\d\+:\zs.\{-}\ze\\\@<!`>'
endfunction"}}}
function! neosnippet#get_sync_placeholder_marker_pattern() "{{{
  return '<{\d\+\%(:.\{-}\)\?\\\@<!}>'
endfunction"}}}
function! neosnippet#get_sync_placeholder_marker_default_pattern() "{{{
  return '<{\d\+:\zs.\{-}\ze\\\@<!}>'
endfunction"}}}
function! neosnippet#get_mirror_placeholder_marker_pattern() "{{{
  return '<|\d\+|>'
endfunction"}}}
function! neosnippet#get_mirror_placeholder_marker_substitute_pattern() "{{{
  return '\$\(\d\+\)'
endfunction"}}}

let &cpo = s:save_cpo
unlet s:save_cpo

" vim: foldmethod=marker
