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
" nnoremap <Leader>g :Gstatus<CR>
"
NeoBundle 'tpope/vim-unimpaired'
NeoBundle 'tpope/vim-surround'
NeoBundle 'tpope/vim-abolish'
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

" Gitv - a git log vizualizer
" depends on tpope/vim-fugitive
NeoBundle 'gitv'
" nnoremap <Leader>gv :Gitv<CR>

NeoBundle 'vim-ruby/vim-ruby'
NeoBundle 'Lokaltog/vim-easymotion'
NeoBundle 'mattn/emmet-vim'
NeoBundle 'godlygeek/tabular'
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
NeoBundle 'majutsushi/tagbar'
NeoBundle 'vim-scripts/EasyGrep'
NeoBundle 'jaredly/vim-debug'
NeoBundle 'rking/ag.vim'

" Airline, pretty ui plugin
NeoBundle 'bling/vim-airline'
let g:airline_theme='powerlineish'
let g:airline_powerline_fonts=1
" let g:airline#extensions#tabline#enabled = 1

NeoBundle 'Shougo/unite.vim'
NeoBundle 'Shougo/neocomplete'
NeoBundle 'Shougo/neosnippet'
NeoBundle 'Shougo/neosnippet-snippets'
NeoBundle 'Shougo/neomru.vim'
NeoBundle 'Shougo/unite-outline'
NeoBundle 'Shougo/vimproc.vim'
NeoBundle 'Shougo/javacomplete'
NeoBundle 'tsukkee/unite-help'
NeoBundle 'thinca/vim-unite-history'
NeoBundle 'scrooloose/nerdtree'
NeoBundle 'rodjek/vim-puppet'
NeoBundle 'ecomba/vim-ruby-refactoring'
NeoBundle 'scrooloose/syntastic'
NeoBundle 'nelstrom/vim-textobj-rubyblock'
NeoBundle 'kana/vim-textobj-user'
NeoBundle 'terryma/vim-multiple-cursors'

" GitGutter, easy diff
NeoBundle 'airblade/vim-gitgutter'
nmap ]h <Plug>GitGutterNextHunk
nmap [h <Plug>GitGutterPrevHunk
nmap <Leader>ha <Plug>GitGutterStageHunk
nmap <Leader>hu <Plug>GitGutterRevertHunk
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

" Don't use Ex mode, use Q for formatting
map Q gq

" This is an alternative that also works in block mode, but the deleted
" text is lost and it only works for putting the current register.
"vnoremap p "_dp

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

let g:airline_theme='powerlineish'
let g:airline_powerline_fonts=1
" let g:airline#extensions#tabline#enabled = 1

" yeah.... use space as the leader
let mapleader = "\<Space>"

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

" Display extra whitespace
" set list listchars=tab:»·,trail:·

" Edit routes
command! Rroutes :e config/routes.rb
command! Rschema :e db/schema.rb

" Local config
if filereadable(".vimrc.local")
  source .vimrc.local
endif

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

autocmd FileType unite call s:unite_my_settings()
function! s:unite_my_settings()
  " Overwrite settings.
  imap <silent><buffer><expr> <C-v> unite#do_action('vsplit')
  imap <silent><buffer><expr> <C-p> unite#do_action('split')
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

" Unite.vim
call unite#filters#matcher_default#use(['matcher_fuzzy'])
call unite#filters#sorter_default#use(['sorter_rank'])
noremap <leader>p :Unite -start-insert buffer file_rec file_mru -no-split<CR>
nnoremap <Leader>l :Unite -start-insert line -auto-preview -vertical<CR>
nnoremap <Leader>m :Unite -start-insert mapping -no-split<CR>
nnoremap <Leader>c :Unite -buffer-name=commands -default-action=execute history/command command -start-insert -no-split<CR>
nnoremap <Leader><Leader>h :Unite -start-insert -no-split help<CR>

" tagbar settings 
let g:tagbar_autoclose='1'
nnoremap <Leader><Leader>o :TagbarToggle<CR>
nnoremap <Leader><Leader>O :Unite -start-insert -no-split outline<CR>
nnoremap <Leader>r :%S/<C-R>s/<C-R>s/gc
nnoremap <Leader>gg :Gstatus<CR>
nnoremap <Leader>G :Gstatus<CR>

nnoremap <Leader>gv :Gitv<CR>
nnoremap <C-W>x :only<CR>

" NERD Tree specific stuff
nnoremap <Leader>P :NERDTreeToggle<CR>

if exists(":Tabularize")
  nmap <Leader>a= :Tabularize /=<CR>
  vmap <Leader>a= :Tabularize /=<CR>
  nmap <Leader>a: :Tabularize /:\zs<CR>
  vmap <Leader>a: :Tabularize /:\zs<CR>
  nmap <Leader>a^ :Tabularize /^\zs<CR>
  vmap <Leader>a^ :Tabularize /^\zs<CR>
endif

" terryma/vim-multiple-cursors
" multi cursor map exit to ctrl+c
let g:multi_cursor_quit_key='<C-C>'

" enable neocomplete
let g:neocomplete#enable_at_startup = 1

" Required:
filetype plugin indent on

" If there are uninstalled bundles found on startup,
" this will conveniently prompt you to install them.
NeoBundleCheck

" Map F2 to toggle paste
nnoremap <F2> :set invpaste paste?<CR>
" Map command W to write with sudo
command! W  write !sudo tee %
