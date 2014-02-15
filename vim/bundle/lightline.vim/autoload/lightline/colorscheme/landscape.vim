" =============================================================================
" Filename: autoload/lightline/colorscheme/landscape.vim
" Version: 0.0
" Author: itchyny
" License: MIT License
" Last Change: 2013/09/07 12:26:11.
" =============================================================================

let s:p = {'normal': {}, 'inactive': {}, 'insert': {}, 'replace': {}, 'visual': {}, 'tabline': {}}
let s:p.normal.left = [ ['#0000ff', '#ffffff', 21, 231, 'bold' ], [ '#ffffff', '#0000ff', 231, 21 ] ]
let s:p.normal.right = [ [ '#303030', '#d0d0d0', 236, 252 ], [ '#303030', '#8a8a8a', 236, 245 ], [ '#bcbcbc', '#585858', 250, 240 ] ]
let s:p.inactive.right = [ [ '#121212', '#606060', 233, 241 ], [ '#121212', '#3a3a3a', 233, 237 ], [ '#121212', '#262626', 233, 235 ] ]
let s:p.inactive.left = s:p.inactive.right[1:]
let s:p.insert.left =  [ ['#005f00', '#ffffff', 22, 231, 'bold' ], [ '#ffffff', '#005f00', 231, 22 ] ]
let s:p.replace.left = [ [ '#af0000', '#ffffff', 124, 231, 'bold' ], [ '#ffffff', '#af0000', 231, 124 ] ]
let s:p.visual.left = [ [ '#5f00ff', '#ffffff', 57, 231, 'bold' ], [ '#ffffff', '#5f00ff', 231, 57 ] ]
let s:p.normal.middle = [ [ '#8a8a8a', '#303030', 245, 236 ] ]
let s:p.inactive.middle = [ [ '#303030', '#121212', 236, 233 ] ]
let s:p.tabline.left = [ [ '#dadada', '#606060', 253, 241 ] ]
let s:p.tabline.tabsel = [ [ '#dadada', '#121212', 253, 233 ] ]
let s:p.tabline.middle = [ [ '#3a3a3a', '#b2b2b2', 237, 249 ] ]
let s:p.tabline.right = [ [ '#dadada', '#606060', 253, 241 ] ]
let s:p.normal.error = [ [ '#d0d0d0', '#ff0000', 252, 196 ] ]
let s:p.normal.warning = [ [ '#262626', '#ffff00', 235, 226 ] ]

let g:lightline#colorscheme#landscape#palette = s:p
