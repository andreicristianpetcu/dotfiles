" based on http://github.com/jferris/config_files/blob/master/vimrc

if has('vim_starting')
  set nocompatible               " Be iMproved

  " Required:
  set runtimepath+=~/.vim/bundle/neobundle.vim/
endif

" yeah.... use space as the leader
let mapleader = "\<Space>"

" Required:
call neobundle#rc(expand('~/.vim/bundle/'))

" Let NeoBundle manage NeoBundle
" Required:
NeoBundleFetch 'Shougo/neobundle.vim'

" My bundles here:
"
" Fugitive - Git wrapper
NeoBundle 'tpope/vim-fugitive'
nnoremap <Leader>ga :Git add . --all<CR>
nnoremap <Leader>gbl :Gblame<CR>
nnoremap <Leader>gbra :Git! branch -a<CR>
nnoremap <Leader>gbrl :Git! branch --list<CR>
nnoremap <Leader>gcb :Git checkout -b 
nnoremap <Leader>gco :Git checkout
nnoremap <Leader>gcm :Git commit -m ""<left>
nnoremap <Leader>gca :Gcommit --amend --reuse-message=HEAD<CR>
nnoremap <Leader>gf :Git fetch<CR>
nnoremap <Leader>ge :Gedit<CR>
nnoremap <Leader>gg :Gstatus<CR>
nnoremap <Leader>gpp :Git push<CR>
nnoremap <Leader>gpf :Git push --force<CR>
nnoremap <Leader>grh :Git reset --hard<CR>
nnoremap <Leader>gsl :Git! stash list<CR>
nnoremap <Leader>gsp :Git stash pop<CR>
nnoremap <Leader>gss :Git stash<CR>
nnoremap <Leader>gu :Git pull<CR>
au FileType gitcommit nmap <buffer> U :Git checkout -- <c-r><c-g><cr>
" git searches
nnoremap <Leader>gri :Git --cached 
nnoremap <Leader>grd :Glog -S --<Left><Left><Left>

" Gitv - a git log vizualizer
" depends on tpope/vim-fugitive
NeoBundle 'gitv'
nnoremap <Leader>gv :Gitv<CR>

" Fast buffer, change, search navigation
NeoBundle 'tpope/vim-unimpaired'
nnoremap ]g do]c:wall<CR>
nnoremap [g do[c:wall<CR>
nnoremap ]r dp]c:wall<CR>
nnoremap [r dp[c:wall<CR>

NeoBundle 'tpope/vim-surround'
NeoBundle 'tpope/vim-abolish'
nnoremap <Leader>s :%S/<C-R>s/<C-R>s/gc

NeoBundle 'tpope/vim-bundler'
NeoBundle 'tpope/vim-rake'
NeoBundle 'tpope/gem-ctags'
NeoBundle 'tpope/gem-browse'

" Rails plugin
NeoBundle 'tpope/vim-rails.git'
" Edit routes
command! Rroutes :e config/routes.rb
command! Rschema :e db/schema.rb

NeoBundle 'tpope/vim-repeat'
NeoBundle 'tpope/vim-endwise'

NeoBundle 'vim-ruby/vim-ruby'
NeoBundle 'tpope/vim-rbenv'

" NeoBundle 'tpope/vim-haml'

" Fast navigation
NeoBundle 'Lokaltog/vim-easymotion'
let g:EasyMotion_keys = 'abcdefghijklmnopqrstuvwxyz1234567890'
let g:EasyMotion_grouping=1
map <Leader>w <Plug>(easymotion-w)
map <Leader>W <Plug>(easymotion-W)
map <Leader>b <Plug>(easymotion-b)
map <Leader>B <Plug>(easymotion-B)
map <Leader>j <Plug>(easymotion-j)
map <Leader>k <Plug>(easymotion-k)

NeoBundle 'mattn/emmet-vim'

" Working with tabular data
NeoBundle 'godlygeek/tabular'
if exists(":Tabularize")
  nmap <Leader>a= :Tabularize /=<CR>
  vmap <Leader>a= :Tabularize /=<CR>
  nmap <Leader>a: :Tabularize /:\zs<CR>
  vmap <Leader>a: :Tabularize /:\zs<CR>
  nmap <Leader>a^ :Tabularize /^\zs<CR>
  vmap <Leader>a^ :Tabularize /^\zs<CR>
endif

NeoBundle 'vim-scripts/tComment'
NeoBundle 'myusuf3/numbers.vim'
NeoBundle 'sickill/vim-monokai'
" snip mate and it's dependencyes
NeoBundle "MarcWeber/vim-addon-mw-utils"
NeoBundle "tomtom/tlib_vim"
" Optional
NeoBundle 'andreicristianpetcu/vim-snippets'

" added ctags support that works
NeoBundle 'szw/vim-tags'

" tagbar, cool outline viewer
NeoBundle 'majutsushi/tagbar'
let g:tagbar_autoclose='1'
nnoremap <Leader>o :TagbarToggle<CR>
let g:tagbar_type_javascript = {
    \ 'ctagsbin' : '~/.local/bin/jsctags'
\ }

NeoBundle 'vim-scripts/EasyGrep'
NeoBundle 'jaredly/vim-debug'

" crazy fast searching
NeoBundle 'rking/ag.vim'
" Ag.vim script for easy search
function! SilverSearch(word)
  let @s = expand(a:word)
  let l:ag_cmd = "Ag " . shellescape(@s) . " ."
  call histadd("cmd", l:ag_cmd)
  set hidden
  execute l:ag_cmd
endfunction
" silver searcher
let g:agprg="ag --column"
" Search with ag for the content of register s
noremap <Leader>sw :call SilverSearch("<cword>")<CR>
noremap <Leader>sW :call SilverSearch("<cWORD>")<CR>
noremap <Leader>ss :call SilverSearch(expand(@0))<CR>
noremap <Leader>sa :Ag 

" greplace
NeoBundle 'skwp/greplace.vim'
" set grepprg=ag
" let g:grep_cmd_opts = '--line-numbers --noheading'
set grepprg=ack
let g:grep_cmd_opts = '--noheading'

" Airline, pretty ui plugin
NeoBundle 'bling/vim-airline'
let g:airline_theme='powerlineish'
let conn=$CONN
if conn != 'sshd'
  let g:airline_powerline_fonts = 1
endif
" fugitive integration
let g:airline#extensions#branch#enabled = 1
" disable syntastic integration
let g:airline#extensions#syntastic#enabled = 1
" enable  tagbar integration
let g:airline#extensions#tagbar#enabled = 1

" Unite - for searching stuff
NeoBundle 'Shougo/unite.vim'
autocmd FileType unite call s:unite_my_settings()
function! s:unite_my_settings()
  " Overwrite settings.
  imap <silent><buffer><expr> <C-v> unite#do_action('vsplit')
  imap <silent><buffer><expr> <C-h> unite#do_action('split')
endfunction
noremap <leader>up :Unite -start-insert buffer file_rec -no-split<CR>
noremap <Leader>ul :Unite -start-insert line -auto-preview -no-split -winheight=40<CR>
nnoremap <Leader>um :Unite -start-insert mapping -no-split<CR>
nnoremap <Leader>uj :Unite -start-insert jump -no-split<CR>
nnoremap <Leader>ue :Unite -start-insert change -no-split<CR>

" most recent files
NeoBundle 'Shougo/neomru.vim'
nnoremap <Leader>uR :Unite -start-insert file_mru -no-split<CR>

" Unite for help
NeoBundle 'tsukkee/unite-help'
nnoremap <Leader>uh :Unite -start-insert -no-split help<CR>

" Unite for outline
NeoBundle 'Shougo/unite-outline'
nnoremap <Leader>uo :Unite -start-insert -no-split outline<CR>

" Unite for command history
NeoBundle 'thinca/vim-unite-history'
nnoremap <Leader>uc :Unite -buffer-name=commands -default-action=execute history/command command -start-insert -no-split<CR>

" Unite for ctags
NeoBundle 'tsukkee/unite-tag'
nnoremap <Leader>ut :Unite tag -start-insert -no-split<CR>
autocmd BufEnter *
\   if empty(&buftype)
\| nnoremap <buffer> <C-]> yiw:Unite -start-insert tag<CR><C-R>0
\| endif

let g:unite_source_tag_max_name_length=30
let g:unite_source_tag_max_fname_length=140

" unite rails
NeoBundle 'basyura/unite-rails'
nnoremap <Leader>ym :Unite rails/model -start-insert -no-split<CR>
nnoremap <Leader>yc :Unite rails/controller -start-insert -no-split<CR>
nnoremap <Leader>yv :Unite rails/view -start-insert -no-split<CR>
nnoremap <Leader>yh :Unite rails/helper -start-insert -no-split<CR>
nnoremap <Leader>yM :Unite rails/mailer -start-insert -no-split<CR>
nnoremap <Leader>yl :Unite rails/lib -start-insert -no-split<CR>
nnoremap <Leader>yd :Unite rails/db -start-insert -no-split<CR>
nnoremap <Leader>yC :Unite rails/config -start-insert -no-split<CR>
nnoremap <Leader>yL :Unite rails/log -start-insert -no-split<CR>
nnoremap <Leader>yj :Unite rails/javascript -start-insert -no-split<CR>
nnoremap <Leader>ys :Unite rails/stylesheet -start-insert -no-split<CR>
nnoremap <Leader>yb :Unite rails/bundle -start-insert -no-split<CR>
nnoremap <Leader>yg :Unite rails/bundled_gem -start-insert -no-split<CR>
nnoremap <Leader>yro :Unite rails/route -start-insert -no-split<CR>

NeoBundle 'rhysd/unite-ruby-require.vim'
nnoremap <Leader>yre ggO<Esc>:Unite ruby/require -start-insert<CR>

NeoBundle 'ujihisa/unite-rake'
nnoremap <Leader>yra :Unite rake -start-insert<CR>

" Autocomplete plugin
NeoBundle 'Shougo/neocomplete'
" enable neocomplete
let g:neocomplete#enable_at_startup = 1
autocmd FileType css setlocal omnifunc=csscomplete#CompleteCSS
autocmd FileType html,markdown setlocal omnifunc=htmlcomplete#CompleteTags
autocmd FileType javascript setlocal omnifunc=javascriptcomplete#CompleteJS
autocmd FileType python setlocal omnifunc=pythoncomplete#Complete
autocmd FileType xml setlocal omnifunc=xmlcomplete#CompleteTags

" NeoBundle 'msanders/snipmate.vim'
" NeoBundle 'matthewsimo/angular-vim-snippets'
NeoBundle 'Shougo/neosnippet'
" NeoBundle 'Shougo/neosnippet-snippets'
" Plugin key-mappings.
imap <C-k>     <Plug>(neosnippet_expand_or_jump)
smap <C-k>     <Plug>(neosnippet_expand_or_jump)
xmap <C-k>     <Plug>(neosnippet_expand_target)
" SuperTab like snippets behavior.
imap <expr><TAB> neosnippet#expandable_or_jumpable() ?
\ "\<Plug>(neosnippet_expand_or_jump)"
\: pumvisible() ? "\<C-n>" : "\<TAB>"
smap <expr><TAB> neosnippet#expandable_or_jumpable() ?
\ "\<Plug>(neosnippet_expand_or_jump)"
\: "\<TAB>"
" For snippet_complete marker.
if has('conceal')
  set conceallevel=2 concealcursor=i
endif
" Tell Neosnippet about the other snippets
let g:neosnippet#snippets_directory='~/.vim/bundle/vim-snippets/snippets'
let g:neosnippet#enable_snipmate_compatibilit = 1

let vimproc_updcmd = has('win64') ?
      \ 'tools\\update-dll-mingw 64' : 'tools\\update-dll-mingw 32'
execute "NeoBundle 'Shougo/vimproc.vim'," . string({
      \ 'build' : {
      \     'windows' : vimproc_updcmd,
      \     'cygwin' : 'make -f make_cygwin.mak',
      \     'mac' : 'make -f make_mac.mak',
      \     'unix' : 'make -f make_unix.mak',
      \    },
      \ })

" code-analysis engine for JavaScript
NeoBundle 'marijnh/tern_for_vim'

" nerdtree - file manager
NeoBundle 'scrooloose/nerdtree'
" NERD Tree specific stuff
" nnoremap <Leader>n :NERDTreeFind<CR>

NeoBundle 'Shougo/vimfiler.vim'
let g:vimfiler_as_default_explorer = 1
" Disable netrw.vim
let g:loaded_netrwPlugin = 1
nnoremap <Leader>nn :VimFilerExplorer -find -safe<CR>
nnoremap <Leader>nd :VimFilerDouble -tab<CR>
" edit files with double ckick
autocmd FileType vimfiler
      \ nmap <buffer> <2-LeftMouse> <Plug>(vimfiler_edit_file)
let g:vimfiler_tree_leaf_icon = ' '
let g:vimfiler_tree_opened_icon = '▾'
let g:vimfiler_tree_closed_icon = '▸'
let g:vimfiler_file_icon = '-'
let g:vimfiler_marked_file_icon = '*'

if &diff
    " diff mode
    set diffopt+=iwhite
endif

NeoBundle 'Shougo/neossh.vim'

NeoBundle 'Shougo/vimshell.vim'

NeoBundle 'rodjek/vim-puppet'

" ruby refactoring
NeoBundle 'ecomba/vim-ruby-refactoring'
nnoremap <leader>Rap  :RAddParameter<cr>
nnoremap <leader>Rcpc :RConvertPostConditional<cr>
nnoremap <leader>Rel  :RExtractLet<cr>
vnoremap <leader>Rec  :RExtractConstant<cr>
vnoremap <leader>Relv :RExtractLocalVariable<cr>
nnoremap <leader>Rit  :RInlineTemp<cr>
vnoremap <leader>Rrlv :RRenameLocalVariable<cr>
vnoremap <leader>Rriv :RRenameInstanceVariable<cr>
vnoremap <leader>Rem  :RExtractMethod<cr>

" Syntastic - simple error checking
NeoBundle 'scrooloose/syntastic'
let g:syntastic_always_populate_loc_list = 1
let g:syntastic_check_on_open = 1
let g:syntastic_javascript_jshint_args = '--config ~/.jshintrc.js'

NeoBundle 'kristijanhusak/vim-multiple-cursors'

" GitGutter, easy diff
NeoBundle 'airblade/vim-gitgutter'
nmap ]h <Plug>GitGutterNextHunk
nmap [h <Plug>GitGutterPrevHunk
nmap <Leader>ha <Plug>GitGutterStageHunk
nmap <Leader>hr <Plug>GitGutterRevertHunk
nmap <Leader>hh :GitGutterToggle<CR>

"copy paths in a easy way
NeoBundle 'vim-scripts/copypath.vim'
let g:copypath_copy_to_unnamed_register = 1

" nice nodejs plugin
NeoBundle 'moll/vim-node'

"css colors
NeoBundle 'ap/vim-css-color'

"closes quotes and other stuff
NeoBundle 'Raimondi/delimitMate'

" Fuzzy finder - fast file navigation
NeoBundle 'vim-scripts/FuzzyFinder'
noremap <Leader>fp :FufCoverageFile<CR>
nnoremap <Leader>fl :FufLine<CR>
nnoremap <Leader>fr :FufMruFile<CR>
nnoremap <Leader>fh :FufHelp<CR>
nnoremap <Leader>fc :FufMruCmd<CR>
let g:fuf_modesDisable = []
let g:fuf_keyOpenSplit = '<C-s>'
let g:fuf_keyOpenVsplit = '<C-v>'
let g:fuf_keyPrevPattern = '<C-h>'
let g:fuf_keyNextPattern = '<C-l>'

" Vim screen - GNU Screen/Tmux integration
NeoBundle 'ervandew/screen'
noremap <Leader>SS V:ScreenSend<CR>
let g:ScreenImpl = 'Tmux'

" making friends with tmux
NeoBundle 'benmills/vimux'
noremap <Leader>xx :call VimuxRunCommand(getline('.'))<CR>j
noremap <Leader>xp :call VimuxRunCommand(expand(@0))<CR>`>j

" easy marks
NeoBundle 'kshenoy/vim-signature'
noremap <Leader>m :SignatureToggle<CR>
let g:SignatureMap = {
      \ 'PurgeMarks' : "<Space>",
      \ 'PurgeMarkers' : "<BS>",
      \ 'GotoNextLineByPos' : "]'",
      \ 'GotoPrevLineByPos' : "['",
      \ 'GotoNextSpotByPos' : "]`",
      \ 'GotoPrevSpotByPos' : "[`",
      \ 'ListLocalMarks' : "'?",
      \ }

" required by vim-text-object
runtime macros/matchit.vim
NeoBundle 'nelstrom/vim-textobj-rubyblock'
NeoBundle 'kana/vim-textobj-user'
NeoBundle 'kana/vim-textobj-indent'
NeoBundle 'kana/vim-textobj-line'
NeoBundle 'kana/vim-textobj-entire'
nmap <Leader>ll mavae='a

" Qdo and Qargs commands
NeoBundle 'MarioRicalde/vim-qargs'

" vim expand region
NeoBundle 'terryma/vim-expand-region'
" Extend the global default (NOTE: Remove comments in dictionary before sourcing)
call expand_region#custom_text_objects({
      \ 'a]'  :1,
      \ 'ab'  :1,
      \ 'aB'  :1,
      \ 'ii'  :0,
      \ 'ai'  :0,
      \ })

" generate docs for javascript
NeoBundle 'heavenshell/vim-jsdoc'

" toggle lists
NeoBundle 'milkypostman/vim-togglelist'
nmap <script> <silent> <leader>tl :call ToggleLocationList()<CR>
nmap <script> <silent> <leader>tq :call ToggleQuickfixList()<CR>

" docker file syntax
NeoBundle 'honza/dockerfile.vim'

" sneak
NeoBundle 'justinmk/vim-sneak'

NeoBundle 'glts/vim-textobj-comment'

" support for coffeescript
NeoBundle 'kchmck/vim-coffee-script'

" Vim auto save
NeoBundle '907th/vim-auto-save'
let g:auto_save = 1

NeoBundle 'kana/vim-textobj-indent'

NeoBundle 'junkblocker/patchreview-vim'

NeoBundle 'codegram/vim-codereview'

NeoBundle 'int3/vim-extradite'
nnoremap <Leader>gE :Extradite<CR>

" vim-scripts repos
NeoBundle 'L9'

" open man pages in vim
runtime ftplugin/man.vim

" allow backspacing over everything in insert mode
set backspace=indent,eol,start

set nobackup
set noswapfile
set nowritebackup
set history=1000		" keep 50 lines of command line history
set ruler		" show the cursor position all the time
set showcmd		" display incomplete commands
set incsearch		" do incremental searching
set cursorline cursorcolumn

" Switch syntax highlighting on, when the terminal has colors
" Also switch on highlighting the last used search pattern.
if (&t_Co > 2 || has("gui_running")) && !exists("syntax_on")
  syntax on
  set hlsearch
endif

if $COLORTERM == 'gnome-terminal' || $TERM == 'xterm' || $TERM == 'screen'
  set t_Co=256
endif

if $COLORTERM == 'drop-down-terminal'
  " set t_Co=256
  colorscheme desert 
else
  " Color scheme
  colorscheme monokai
endif

" Switch wrap off for everything
set nowrap

" Only do this part when compiled with support for autocommands.
if has("autocmd")
  " Enable file type detection.
  " Use the default filetype settings, so that mail gets 'tw' set to 72,
  " 'cindent' is on in C files, etc.
  " Also load indent files, to automatically do language-dependent indenting.
  filetype plugin indent on

  " Set File type to 'text' for files ending in .txt
  autocmd BufNewFile,BufRead *.txt setfiletype text

  " Enable soft-wrapping for text files
  autocmd FileType text,markdown,html,xhtml,eruby setlocal wrap linebreak nolist

  " Put these in an autocmd group, so that we can delete them easily.
  augroup vimrcEx
  au!

  " For all text files set 'textwidth' to 78 characters.
  " autocmd FileType text setlocal textwidth=78

  " When editing a file, always jump to the last known cursor position.
  " Don't do it when the position is invalid or when inside an event handler
  " (happens when dropping a file on gvim).
  autocmd BufReadPost *
    \ if line("'\"") > 0 && line("'\"") <= line("$") |
    \   exe "normal g`\"" |
    \ endif

  augroup END

else
  set autoindent		" always set autoindenting on
endif

" Softtabs, 2 spaces
set tabstop=2
set shiftwidth=2
set expandtab

" Always display the status line
set laststatus=2

" Hide search highlighting
map <Leader>H :set invhls <CR>

" Opens an edit command with the path of the currently edited file filled in
" Normal mode: <Leader>e
map <Leader>e :e <C-R>=expand("%:p:h") . "/" <CR>

" Opens a tab edit command with the path of the currently edited file filled in
" Normal mode: <Leader>t
map <Leader>Te :tabe <C-R>=expand("%:p:h") . "/" <CR>

" Inserts the path of the currently edited file into a command
" Command mode: Ctrl+P
cmap <C-P> <C-R>=expand("%:p:h") . "/" <CR>

" Duplicate a selection
" Visual mode: D
vmap D y'>p

" Press Shift+P while in visual mode to replace the selection without
" overwriting the default register
vmap P p :call setreg('"', getreg('0')) <CR>

" For Haml
au! BufRead,BufNewFile *.haml         setfiletype haml

" No Help, please
nmap <F1> <Esc>

" Press ^F from insert mode to insert the current file name
imap <C-F> <C-R>=expand("%")<CR>

" Maps autocomplete to tab
" imap <Tab> <C-N>

imap <C-L> <Space>=><Space>

" Use Ack instead of Grep when available
if executable("ack")
  set grepprg=ack\ -H\ --nogroup\ --nocolor\ --ignore-dir=tmp\ --ignore-dir=coverage
endif


" Numbers
set number
set numberwidth=5

" Tab completion options
" (only complete to the longest unambiguous match, and show a menu)
set completeopt=longest,menu
set wildmode=list:longest,list:full
set complete=.,t

" case only matters with mixed case expressions
set ignorecase
set smartcase


" Write file
nnoremap ZW :w<CR>
nnoremap ZA :wall<CR>

" set the system cliboard as the default yank source                                                                                                                                                                                      
set clipboard=unnamedplus 

" Minimize and maximize
nnoremap <C-W>O :call MaximizeToggle()<CR>
nnoremap <C-W>o :call MaximizeToggle()<CR>
nnoremap <C-W><C-O> :call MaximizeToggle()<CR>
function! MaximizeToggle()
  if exists("s:maximize_session")
    exec "source " . s:maximize_session
    call delete(s:maximize_session)
    unlet s:maximize_session
    let &hidden=s:maximize_hidden_save
    unlet s:maximize_hidden_save
  else
    let s:maximize_hidden_save = &hidden
    let s:maximize_session = tempname()
    set hidden
    exec "mksession! " . s:maximize_session
    only
  endif
endfunction

" copy the default clipboard into the system clipboard
map <Leader>= :let @+=@"<CR>

" You complete me disabled for tab, only for control space
" let g:ycm_auto_trigger = 0
let g:ycm_key_list_select_completion = ['<C-j>', '<C-Space>']
let g:ycm_key_list_previous_completion = ['<C-k']

" numbers do not show for Control+C, they show only for Esc
map <C-C> <ESC>
" search with ag for the content of register s
map <Leader>a :call SilverSearch("<cword>")<CR>
map <Leader>A :call SilverSearch("<cWORD>")<CR>

nnoremap <C-W>x :only<CR>

" terryma/vim-multiple-cursors
" multi cursor map exit to ctrl+c
let g:multi_cursor_quit_key='<C-C>'

" Required:
filetype plugin indent on

" If there are uninstalled bundles found on startup,
" this will conveniently prompt you to install them.
NeoBundleCheck

" Map F2 to toggle paste
inoremap <F8> <Esc>:set nopaste<CR>
nnoremap <F7> <C-c>:set paste<CR>i

" Map command W to write with sudo
command! W  write !sudo tee %
command! Q  quitall

" map find replace
nnoremap <Leader>rr :%s/<C-R>0//gc<left><left><left>
nnoremap <Leader>rR :%S/<C-R>0//gc<left><left><left>
nnoremap <Leader>rww yiw:%s/<C-R>0//gc<left><left><left>
nnoremap <Leader>rwW yiw:%S/<C-R>0//gc<left><left><left>
nnoremap <Leader>rWw yiW:%s/<C-R>0//gc<left><left><left>
nnoremap <Leader>rWW yiW:%S/<C-R>0//gc<left><left><left>
nnoremap <Leader>rs :%s///gc<left><left><left><left>
nnoremap <Leader>rS :%S///gc<left><left><left><left>

" added easy jump to next and previous paragraps
noremap <Leader>} }}(
noremap <Leader>{ {{)

nnoremap <Leader>TN :tabnew<CR>
nnoremap <Leader>TC :tabclose<CR>

" Enable mouse use in all modes
set mouse=a

"be lazy
" set lazyredraw

" reload .vimrc
command! Reloadvimrc :so $MYVIMRC
command! Editvimrc :e $MYVIMRC
