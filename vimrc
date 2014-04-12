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
nnoremap <Leader>gg :Gstatus<CR>
nnoremap <Leader>gp :Git push<CR>
nnoremap <Leader>gu :Git pull<CR>
nnoremap <Leader>gf :Git fetch<CR>
nnoremap <Leader>ga :Git add . --all<CR>
nnoremap <Leader>grh :Git git reset --hard<CR>
nnoremap <Leader>gbl :Git branch --list<CR>
nnoremap <Leader>gba :Git branch -a<CR>
nnoremap <Leader>gco :Git checkout
nnoremap <Leader>gcb :Git checkout -b 
nnoremap <Leader>gss :Git stash<CR>
nnoremap <Leader>gsl :Git stash list<CR>
nnoremap <Leader>gsp :Git stash pop<CR>

" Gitv - a git log vizualizer
" depends on tpope/vim-fugitive
NeoBundle 'gitv'
nnoremap <Leader>gv :Gitv<CR>

" Fast buffer, change, search navigation
NeoBundle 'tpope/vim-unimpaired'
nnoremap ]g do]c:wall<CR>
nnoremap [g do[c:wall<CR>
nnoremap ]p dp]c:wall<CR>
nnoremap [p dp[c:wall<CR>

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

" Fast navigation
NeoBundle 'Lokaltog/vim-easymotion'
let g:EasyMotion_keys = 'abcdefghijklmnopqrstuvwxyz'
let g:EasyMotion_grouping=1

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
NeoBundle "garbas/vim-snipmate"
" Optional:
NeoBundle "honza/vim-snippets"

" vim-misk is needed by vim-easytags
NeoBundle 'xolox/vim-misc'
NeoBundle 'xolox/vim-easytags'

" tagbar, cool outline viewer
NeoBundle 'majutsushi/tagbar'
let g:tagbar_autoclose='1'
nnoremap <Leader>o :TagbarToggle<CR>

NeoBundle 'vim-scripts/EasyGrep'
NeoBundle 'jaredly/vim-debug'
NeoBundle 'rking/ag.vim'

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
noremap <Leader>ul :Unite -start-insert line -auto-preview -vertical<CR>
nnoremap <Leader>um :Unite -start-insert mapping -no-split<CR>

" most recent files
NeoBundle 'Shougo/neomru.vim'
nnoremap <Leader>ur :Unite -start-insert file_mru -no-split<CR>

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
\| nnoremap <buffer> <C-]> :<C-u>UniteWithCursorWord -immediately tag<CR>
\| endif

" Autocomplete plugin
NeoBundle 'Shougo/neocomplete'
" enable neocomplete
let g:neocomplete#enable_at_startup = 1

NeoBundle 'Shougo/neosnippet'
NeoBundle 'Shougo/neosnippet-snippets'
NeoBundle 'Shougo/vimproc.vim'
NeoBundle 'Shougo/javacomplete'

" nerdtree - file manager
NeoBundle 'scrooloose/nerdtree'
" NERD Tree specific stuff
nnoremap <Leader>n :NERDTreeToggle<CR>

NeoBundle 'rodjek/vim-puppet'
NeoBundle 'ecomba/vim-ruby-refactoring'

" Syntastic - simple error checking
NeoBundle 'scrooloose/syntastic'
let g:syntastic_always_populate_loc_list = 1
let g:syntastic_check_on_open = 1

NeoBundle 'nelstrom/vim-textobj-rubyblock'
NeoBundle 'kana/vim-textobj-user'
NeoBundle 'terryma/vim-multiple-cursors'

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


" required by vim-text-object
runtime macros/matchit.vim

" vim-scripts repos
NeoBundle 'L9'

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

  " Automatically load .vimrc source when saved
  autocmd BufWritePost .vimrc source $MYVIMRC

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
map <Leader>te :tabe <C-R>=expand("%:p:h") . "/" <CR>

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

" Snippets are activated by Shift+Tab
let g:snippetsEmu_key = "<S-Tab>"

" Tab completion options
" (only complete to the longest unambiguous match, and show a menu)
set completeopt=longest,menu
set wildmode=list:longest,list:full
set complete=.,t

" case only matters with mixed case expressions
set ignorecase
set smartcase

" Tags
let g:Tlist_Ctags_Cmd="ctags --exclude='*.js'"
set tags=./tags;

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

" copy the default clipboard into the system clipboard
map <Leader>= :let @+=@"<CR>

" You complete me disabled for tab, only for control space
" let g:ycm_auto_trigger = 0
let g:ycm_key_list_select_completion = ['<C-j>', '<C-Space>']
let g:ycm_key_list_previous_completion = ['<C-k']

" Remap tab to snip mate
imap <Tab> <Plug>snipMateNextOrTrigger
smap <Tab> <Plug>snipMateNextOrTrigger

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
nnoremap <F2> :set invpaste paste?<CR>
" Map command W to write with sudo
command! W  write !sudo tee %
