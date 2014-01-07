" based on http://github.com/jferris/config_files/blob/master/vimrc

" Use Vim settings, rather then Vi settings (much better!).
" This must be first, because it changes other options as a side effect.
set nocompatible              " be iMproved
filetype off                  " required!

set rtp+=~/.vim/bundle/vundle/
call vundle#rc()

"let Vundle manage Vundle
" required! 
Bundle 'gmarik/vundle'

" My bundles here:
"
" original repos on GitHub
Bundle 'tpope/vim-fugitive'
Bundle 'tpope/vim-unimpaired'
Bundle 'tpope/vim-surround'
Bundle 'tpope/vim-abolish'
Bundle 'tpope/vim-rails.git'
Bundle 'tpope/vim-repeat'
Bundle 'vim-ruby/vim-ruby'
Bundle 'Lokaltog/vim-easymotion'
Bundle 'mattn/emmet-vim'
Bundle 'scrooloose/nerdtree'
Bundle 'godlygeek/tabular'
Bundle 'vim-scripts/tComment'
Bundle 'myusuf3/numbers.vim'
Bundle 'sickill/vim-monokai'
" snip mate and it's dependencyes
Bundle "MarcWeber/vim-addon-mw-utils"
Bundle "tomtom/tlib_vim"
Bundle "garbas/vim-snipmate"
" Optional:
Bundle "honza/vim-snippets"

" vim-misk is needed by vim-easytags
Bundle 'xolox/vim-misc'
Bundle 'xolox/vim-easytags'
Bundle 'taglist.vim'
Bundle 'majutsushi/tagbar'
Bundle 'Valloric/YouCompleteMe'
Bundle 'vim-scripts/EasyGrep'
Bundle 'jaredly/vim-debug'
Bundle 'rking/ag.vim'
Bundle 'Lokaltog/powerline', {'rtp': 'powerline/bindings/vim/'}
Bundle 'Shougo/unite.vim'
Bundle 'tsukkee/unite-help'
Bundle 'thinca/vim-unite-history'
Bundle 'Shougo/unite-outline'
" Bundle 'Shougo/vimproc.vim'


" vim-scripts repos
Bundle 'L9'

" allow backspacing over everything in insert mode
set backspace=indent,eol,start

set nobackup
set noswapfile
set nowritebackup
set history=1000		" keep 50 lines of command line history
set ruler		" show the cursor position all the time
set showcmd		" display incomplete commands
set incsearch		" do incremental searching
set cursorline

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

endif " has("autocmd")

" if has("folding")
  " set foldenable
  " set foldmethod=syntax
  " set foldlevel=1
  " set foldnestmax=2
  " set foldtext=strpart(getline(v:foldstart),0,50).'\ ...\ '.substitute(getline(v:foldend),'^[\ #]*','','g').'\ '
" endif

" Softtabs, 2 spaces
set tabstop=2
set shiftwidth=2
set expandtab

" Always display the status line
set laststatus=2

" \ is the leader character
let mapleader = ","

" Edit the README_FOR_APP (makes :R commands work)
" map <Leader>R :e doc/README_FOR_APP<CR>

" Leader shortcuts for Rails commands
" map <Leader>m :Rmodel 
" map <Leader>c :Rcontroller 
" map <Leader>v :Rview 
" map <Leader>u :Runittest 
" map <Leader>f :Rfunctionaltest 
" map <Leader>f :FufFile<CR>
" map <Leader>tm :RTmodel 
" map <Leader>tc :RTcontroller 
" map <Leader>tv :RTview 
" map <Leader>tu :RTunittest 
" map <Leader>tf :RTfunctionaltest 
" map <Leader>sm :RSmodel 
" map <Leader>sc :RScontroller 
" map <Leader>sv :RSview 
" map <Leader>su :RSunittest 
" map <Leader>sf :RSfunctionaltest 

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
  let @s = shellescape(expand(a:word))
  let l:ag_cmd = "Ag " . @s . " ."
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
map <Leader><leader>a :call SilverSearch("<cword>")<CR>
map <Leader><leader>A :call SilverSearch("<cWORD>")<CR>

" Unite.vim
nnoremap <leader><leader>p :Unite -start-insert buffer file_rec file_mru -no-split<CR>
nnoremap <Leader><leader>l :Unite -start-insert line -auto-preview -vertical<CR>
nnoremap <Leader><leader>m :Unite -start-insert mapping -no-split<CR>
nnoremap <Leader><leader>c :Unite -buffer-name=commands -default-action=execute history/command command -start-insert -no-split<CR>
nnoremap <Leader><Leader>h :Unite -start-insert -no-split help<CR>
nnoremap <Leader><Leader>o :Unite -start-insert -no-split outline<CR>
nnoremap <Leader><leader>q :Unite q:all<CR>
nnoremap <C-W>x :only<CR>
