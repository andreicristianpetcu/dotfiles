" yeah.... use space as the leader
let mapleader = "\<Space>"

if has('vim_starting')
  set nocompatible

  let plug_vim=expand('~/.vim/autoload/plug.vim')
  if !filereadable(plug_vim)
    silent !mkdir -p ~/.vim/autoload
    silent !curl -fLo ~/.vim/autoload/plug.vim https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
    autocmd VimEnter * PlugInstall
  endif

endif

call plug#begin('~/.vim/bundle')

" Required:
" call neobundle#rc(expand('~/.vim/bundle/'))
command! PlugTakeSnapshot PlugSnapshot ~/.vim_plug_snapshot.sh

" Let NeoBundle manage NeoBundle
" Required:
" NeoBundleFetch 'Shougo/neobundle.vim'

" Fugitive - Git wrapper
Plug 'tpope/vim-fugitive'
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
nnoremap <Leader>gt :tab split +Gstatus<CR>
nnoremap <Leader>gpp :Git push<CR>
nnoremap <Leader>gpa :Git push --all<CR>
nnoremap <Leader>gpf :Git push --force<CR>
nnoremap <Leader>grh :Git reset --hard<CR>
nnoremap <Leader>gsl :Git! stash list<CR>
nnoremap <Leader>gsp :Git stash pop<CR>
nnoremap <Leader>gss :Git stash<CR>
nnoremap <Leader>gu :Git pull<CR>
nnoremap <Leader>gd :Gdiff<CR>
nnoremap <Leader>gre :Gread<CR>w!
au FileType gitcommit nmap <buffer> U :Git checkout -- <c-r><c-g><cr>
" git searches
nnoremap <Leader>gri :Git --cached 
nnoremap <Leader>grd :Glog -S --<Left><Left><Left>

Plug 'kablamo/vim-git-log'
nnoremap <Leader>gl :GitLog<CR>
nnoremap <Leader>grr :Ribbon<CR>
nnoremap <Leader>gru :RibbonSave<CR>:Git pull<CR>
nnoremap <Leader>grs :RibbonSave<CR>

" Gitv - a git log vizualizer
" depends on tpope/vim-fugitive
Plug 'gitv'
nnoremap <Leader>gv :Gitv<CR>

Plug 'int3/vim-extradite'
nnoremap <Leader>gE :Extradite<CR>

Plug 'sjl/gundo.vim'
if !isdirectory(expand("~/.vim/tmp/undo/"))
  silent !mkdir -p ~/.vim/tmp/undo
endif
set undofile
set undodir=~/.vim/tmp/undo//
" set backupdir=~/.vim/tmp/backup
" set directory=~/.vim/tmp/swap
" set backupskip=/tmp/*
" set backup
" set writebackup
set noswapfile
set history=20
set undolevels=20
noremap <Leader>gn :GundoToggle<CR>

Plug 'mbbill/undotree'
noremap <Leader>gN :UndotreeToggle<CR>

" Fast buffer, change, search navigation
Plug 'tpope/vim-unimpaired'
nnoremap ]g do]c:wall<CR>
nnoremap [g do[c:wall<CR>
nnoremap ]r dp]c:wall<CR>
nnoremap [r dp[c:wall<CR>

Plug 'tpope/vim-surround'
Plug 'tpope/vim-abolish'
nnoremap <Leader>\ff yiw:%S/<C-R>0/<C-R>0/gc<left><left><left><left>
nnoremap <Leader>\fw yiw:%S/<C-R>0/<C-R>0/gc<left><left><left>
nnoremap <Leader>\fW yiW:%S/<C-R>0/<C-R>0/gc<left><left><left>
nnoremap <Leader>\f0 :%S///gc<left><left><left><left>
nnoremap <Leader>\fs :%S///gc<left><left><left><left>

Plug 'tpope/vim-repeat'
Plug 'tpope/vim-endwise'

Plug 'vim-ruby/vim-ruby'
Plug 'tpope/vim-rbenv'

Plug 'tpope/vim-haml'

" Fast navigation
Plug 'Lokaltog/vim-easymotion'
let g:EasyMotion_keys = 'abcdefghijklmnopqrstuvwxyz1234567890'
let g:EasyMotion_grouping=1
map <Leader>w <Plug>(easymotion-w)
map <Leader>W <Plug>(easymotion-W)
map <Leader>b <Plug>(easymotion-b)
map <Leader>B <Plug>(easymotion-B)
map <Leader>j <Plug>(easymotion-j)
map <Leader>k <Plug>(easymotion-k)

Plug 'mattn/emmet-vim'

" Working with tabular data
Plug 'godlygeek/tabular'
if exists(":Tabularize")
  nmap <Leader>a= :Tabularize /=<CR>
  vmap <Leader>a= :Tabularize /=<CR>
  nmap <Leader>a: :Tabularize /:\zs<CR>
  vmap <Leader>a: :Tabularize /:\zs<CR>
  nmap <Leader>a^ :Tabularize /^\zs<CR>
  vmap <Leader>a^ :Tabularize /^\zs<CR>
endif

Plug 'vim-scripts/tComment'
Plug 'myusuf3/numbers.vim'

Plug 'andreicristianpetcu/vim-monokai', { 'do': 'rm -rf ~/.vim/colors/monokai.vim && mkdir -p ~/.vim/colors && ln -s ~/.vim/bundle/vim-monokai/colors/monokai.vim ~/.vim/colors/monokai.vim' }
Plug 'altercation/vim-colors-solarized'

" snip mate and it's dependencyes
Plug 'MarcWeber/vim-addon-mw-utils'
Plug 'tomtom/tlib_vim'
" Optional
Plug 'andreicristianpetcu/vim-snippets'

Plug 'andreicristianpetcu/argarg.vim'
" autocmd VimEnter * ArgArgLoadGitArgs

" added ctags support that works
Plug 'szw/vim-tags'

" tagbar, cool outline viewer
Plug 'majutsushi/tagbar'
let g:tagbar_autoclose='1'
nnoremap <Leader>o :TagbarToggle<CR>
let g:tagbar_type_javascript = {
    \ 'ctagsbin' : '~/.local/bin/jsctags'
\ }

Plug 'jaredly/vim-debug'

" crazy fast searching
Plug 'rking/ag.vim'
" Ag.vim script for easy search
function! SilverSearch(word)
  let @s = expand(a:word)
  let l:ag_cmd = "Ag -Q " . shellescape(@s) . " ."
  call histadd("cmd", l:ag_cmd)
  set hidden
  execute l:ag_cmd
endfunction

" silver searcher
let g:agprg="ag -Q --column"
" Search with ag for the content of register s
noremap <Leader>// :call SilverSearch("<cword>")<CR>
noremap <Leader>/w :call SilverSearch("<cword>")<CR>
noremap <Leader>/W :call SilverSearch("<cWORD>")<CR>
noremap <Leader>/0 :call SilverSearch(expand(@0))<CR>
noremap <Leader>// :Ag -Q 
noremap <Leader>/a' ya':call SilverSearch(expand(@0))<CR>
noremap <Leader>/a" ya":call SilverSearch(expand(@0))<CR>
noremap <Leader>/i' yi':call SilverSearch(expand(@0))<CR>
noremap <Leader>/i" yi":call SilverSearch(expand(@0))<CR>

" greplace
Plug 'skwp/greplace.vim'
" set grepprg=ag
" let g:grep_cmd_opts = '--line-numbers --noheading'
set grepprg=ack
let g:grep_cmd_opts = '--noheading'
nnoremap <Leader>\rq :Gqfopen<CR>
nnoremap <Leader>\rg :Greplace<CR>

" map find replace
nnoremap <Leader>\\ yiw:%s/<C-R>0/<C-R>0/gc<left><left><left>
nnoremap <Leader>\w yiw:%s/<C-R>0/<C-R>0/gc<left><left><left>
nnoremap <Leader>\W yiW:%s/<C-R>0/<C-R>0/gc<left><left><left>
nnoremap <Leader>\0 :%s/<C-R>0/<C-R>0/gc<left><left><left>
nnoremap <Leader>\s :%s///gc<left><left><left><left>

" Airline, pretty ui plugin
Plug 'bling/vim-airline'
let g:airline_theme='powerlineish'
let g:airline#extensions#tabline#tab_min_count = 2
let g:airline#extensions#tabline#enabled = 1
let g:airline#extensions#tabline#show_buffers = 0
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
Plug 'Shougo/unite.vim'
autocmd FileType unite call s:unite_my_settings()
function! s:unite_my_settings()
  " Overwrite settings.
  imap <silent><buffer><expr> <C-v> unite#do_action('vsplit')
  imap <silent><buffer><expr> <C-h> unite#do_action('split')
  imap <silent><buffer><expr> <C-t> unite#do_action('tabopen')
endfunction
noremap <leader>/p :Unite -start-insert buffer file_rec<CR>
noremap <Leader>/l :Unite -start-insert line -auto-preview -winheight=40 -no-split<CR>
nnoremap <Leader>/m :Unite -start-insert mapping<CR>
nnoremap <Leader>/j :Unite -start-insert jump<CR>
nnoremap <Leader>/e :Unite -start-insert change<CR>
nnoremap <Leader>/r :UniteResume -start-insert<CR>
noremap <Leader>/lw yiw:Unite -start-insert line -auto-preview -winheight=40 -no-split<CR><C-R>0<ESC>
noremap <Leader>/lW yiW:Unite -start-insert line -auto-preview -winheight=40 -no-split<CR><C-R>0<ESC> 

let g:unite_source_grep_max_candidates = 200
if executable('ag')
  " Use ag in unite grep source.
  let g:unite_source_grep_command = 'ag'
  let g:unite_source_grep_default_opts =
  \ '-i --line-numbers --nocolor --nogroup --hidden --ignore --literal' .
  \  '''.hg'' --ignore ''.svn'' --ignore ''.git'' --ignore ''.bzr'''
  let g:unite_source_grep_recursive_opt = ''
endif
nnoremap <space>/2 :Unite grep:. -start-insert<cr>

" Angular.js stuff
noremap <leader>ac :Unite -start-insert file_rec<CR>!bower_components !node_modules app scripts controller  .js<left><left><left><left>
noremap <leader>as :Unite -start-insert file_rec<CR>!bower_components !node_modules app scripts service  .js<left><left><left><left>
noremap <leader>ad :Unite -start-insert file_rec<CR>!bower_components !node_modules app scripts directive  .js<left><left><left><left>
noremap <leader>am :Unite -start-insert file_rec<CR>!bower_components !node_modules app !controller !service !directive  .js<left><left><left><left>
noremap <leader>av :Unite -start-insert file_rec<CR>!bower_components !node_modules app views  .html<left><left><left><left><left><left>
noremap <leader>aS :Unite -start-insert file_rec<CR>!bower_components !node_modules app styles  .css<left><left><left><left><left>
noremap <leader>atc :Unite -start-insert file_rec<CR>!bower_components !node_modules test controller  .js<left><left><left><left>
noremap <leader>ats :Unite -start-insert file_rec<CR>!bower_components !node_modules test service  .js<left><left><left><left>
noremap <leader>atd :Unite -start-insert file_rec<CR>!bower_components !node_modules test directive  .js<left><left><left><left>
noremap <leader>ab :Unite -start-insert file_rec<CR>bower_components 
noremap <leader>an :Unite -start-insert file_rec<CR>node_modules 

" most recent files
Plug 'Shougo/neomru.vim'
nnoremap <Leader>/R :Unite -start-insert file_mru<CR>

" Unite for help
Plug 'tsukkee/unite-help'
nnoremap <Leader>/h :Unite -start-insert help<CR>

" Unite for outline
Plug 'Shougo/unite-outline'
nnoremap <Leader>/o :Unite -start-insert outline<CR>

" Unite for command history
Plug 'thinca/vim-unite-history'
nnoremap <Leader>/c :Unite -buffer-name=commands -default-action=execute history/command command -start-insert<CR>

" Unite for ctags
Plug 'tsukkee/unite-tag'
nnoremap <Leader>/t :Unite tag -start-insert<CR>
autocmd BufEnter *
\   if empty(&buftype)
\| nnoremap <buffer> <C-]> yiw:Unite -start-insert tag<CR><C-R>0
\| endif

let g:unite_source_tag_max_name_length=30
let g:unite_source_tag_max_fname_length=140

" unite rails
Plug 'basyura/unite-rails'
nnoremap <Leader>rm :Unite rails/model -start-insert<CR>
nnoremap <Leader>rM :Unite rails/mailer -start-insert<CR>
nnoremap <Leader>rc :Unite rails/controller -start-insert<CR>
nnoremap <Leader>rv :Unite rails/view -start-insert<CR>
nnoremap <Leader>rh :Unite rails/helper -start-insert<CR>
nnoremap <Leader>rl :Unite rails/lib -start-insert<CR>
nnoremap <Leader>rd :Unite rails/db -start-insert<CR>
nnoremap <Leader>rC :Unite rails/config -start-insert<CR>
nnoremap <Leader>rL :Unite rails/log -start-insert<CR>
nnoremap <Leader>rj :Unite rails/javascript -start-insert<CR>
nnoremap <Leader>rs :Unite rails/stylesheet -start-insert<CR>
nnoremap <Leader>rb :Unite rails/bundle -start-insert<CR>
nnoremap <Leader>rge :Unite rails/bundled_gem -start-insert<CR>
nnoremap <Leader>rro :Unite rails/route -start-insert<CR>

Plug 'rhysd/unite-ruby-require.vim'
nnoremap <Leader>re ggO<Esc>:Unite ruby/require -start-insert<CR>

Plug 'ujihisa/unite-rake'
nnoremap <Leader>ra :Unite rake -start-insert<CR>

Plug 'ujihisa/unite-colorscheme'

Plug 'tpope/vim-bundler'
nnoremap <Leader>rgo :Bopen<CR>
nnoremap <Leader>rgi :Bundle install<CR>

Plug 'tpope/vim-rake'
Plug 'tpope/gem-ctags'
Plug 'tpope/gem-browse'

" Rails plugin
Plug 'tpope/vim-rails'
" Edit routes
command! Rroutes :e config/routes.rb
command! Rschema :e db/schema.rb

Plug 'thoughtbot/vim-rspec'
Plug 'tpope/vim-cucumber'
Plug 'tpope/vim-dispatch'
Plug 'asux/vim-capybara'

Plug 'burnettk/vim-angular'
let g:angular_source_directory = 'uwezo-presentation/yo/app'
let g:angular_test_directory = 'uwezo-presentation/yo/app/test/spec'

"Autocomplete plugin
Plug 'Shougo/neocomplete'
" enable neocomplete
let g:neocomplete#enable_at_startup = 1
autocmd FileType css setlocal omnifunc=csscomplete#CompleteCSS
autocmd FileType html,markdown setlocal omnifunc=htmlcomplete#CompleteTags
autocmd FileType javascript setlocal omnifunc=javascriptcomplete#CompleteJS
autocmd FileType python setlocal omnifunc=pythoncomplete#Complete
autocmd FileType xml setlocal omnifunc=xmlcomplete#CompleteTags

Plug 'Shougo/neosnippet'
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

" let vimproc_updcmd = has('win64') ?
"       \ 'tools\\update-dll-mingw 64' : 'tools\\update-dll-mingw 32'
" execute "Plug 'Shougo/vimproc.vim'," . string({
"       \ 'build' : {
"       \     'windows' : vimproc_updcmd,
"       \     'cygwin' : 'make -f make_cygwin.mak',
"       \     'mac' : 'make -f make_mac.mak',
"       \     'unix' : 'make -f make_unix.mak',
"       \    },
"       \ })


" code-analysis engine for JavaScript
Plug 'marijnh/tern_for_vim'

Plug 'Shougo/vimfiler.vim'
let g:vimfiler_as_default_explorer = 1
" Disable netrw.vim
let g:loaded_netrwPlugin = 1
nnoremap <Leader>ff :VimFilerExplorer -find -winwidth=80<CR>
nnoremap <Leader>fd :VimFilerDouble -tab<CR>
" edit files with double ckick
autocmd FileType vimfiler
      \ nmap <buffer> <2-LeftMouse> <Plug>(vimfiler_edit_file)
autocmd FileType vimfiler
      \ nmap <buffer> <CR> <Plug>(vimfiler_edit_file)
let g:vimfiler_tree_leaf_icon = ' '
let g:vimfiler_tree_opened_icon = '▾'
let g:vimfiler_tree_closed_icon = '▸'
let g:vimfiler_file_icon = '-'
let g:vimfiler_marked_file_icon = '*'

if &diff
    " diff mode
    set diffopt+=iwhite
endif

Plug 'scrooloose/nerdtree'
Plug 'Xuyuanp/nerdtree-git-plugin'
nnoremap <Leader>fn :NERDTreeFind<CR>


Plug 'Shougo/neossh.vim'

Plug 'Shougo/vimshell.vim'

Plug 'rodjek/vim-puppet'

" ruby refactoring
Plug 'ecomba/vim-ruby-refactoring'
nnoremap <leader>rfap  :RAddParameter<cr>
nnoremap <leader>rfcpc :RConvertPostConditional<cr>
nnoremap <leader>rfel  :RExtractLet<cr>
vnoremap <leader>rfec  :RExtractConstant<cr>
vnoremap <leader>rfelv :RExtractLocalVariable<cr>
nnoremap <leader>rfit  :RInlineTemp<cr>
vnoremap <leader>rfrlv :RRenameLocalVariable<cr>
vnoremap <leader>rfriv :RRenameInstanceVariable<cr>
vnoremap <leader>rfem  :RExtractMethod<cr>

" Syntastic - simple error checking
Plug 'scrooloose/syntastic'
let g:syntastic_always_populate_loc_list = 1
let g:syntastic_check_on_open = 1
let g:syntastic_javascript_jshint_args = '--config ~/.jshintrc.js'

" GitGutter, easy diff
Plug 'airblade/vim-gitgutter'
nmap ]h <Plug>GitGutterNextHunk
nmap [h <Plug>GitGutterPrevHunk
nmap <Leader>ha <Plug>GitGutterStageHunk
nmap <Leader>hr <Plug>GitGutterRevertHunk
nmap <Leader>hh :GitGutterToggle<CR>

"copy paths in a easy way
Plug 'vim-scripts/copypath.vim'
let g:copypath_copy_to_unnamed_register = 1

" nice nodejs plugin
Plug 'moll/vim-node'

"css colors
Plug 'ap/vim-css-color'

"closes quotes and other stuff
Plug 'Raimondi/delimitMate'

" Vim screen - GNU Screen/Tmux integration
Plug 'ervandew/screen'
noremap <Leader>SS V:ScreenSend<CR>
let g:ScreenImpl = 'Tmux'

" making friends with tmux
Plug 'benmills/vimux'
noremap <Leader>xx :call VimuxRunCommand(getline('.'))<CR>j
noremap <Leader>xp :call VimuxRunCommand(expand(@0))<CR>`>j

" easy marks
Plug 'kshenoy/vim-signature'
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
Plug 'nelstrom/vim-textobj-rubyblock'
Plug 'kana/vim-textobj-user'
Plug 'kana/vim-textobj-indent'
Plug 'kana/vim-textobj-line'
Plug 'kana/vim-textobj-entire'
nmap <Leader>= mavae='a

" Qdo and Qargs commands
Plug 'MarioRicalde/vim-qargs'

" vim expand region
Plug 'terryma/vim-expand-region'
" Extend the global default (NOTE: Remove comments in dictionary before sourcing)
"//todo//andrei//bring it back
"  call expand_region#custom_text_objects({
"        \ 'a]'  :1,
"        \ 'ab'  :1,
"        \ 'aB'  :1,
"        \ 'ii'  :0,
"        \ 'ai'  :0,
"        \ })

" generate docs for javascript
Plug 'heavenshell/vim-jsdoc'

" toggle lists
Plug 'milkypostman/vim-togglelist'
nmap <script> <silent> <leader>tl :call ToggleLocationList()<CR>
nmap <script> <silent> <leader>tq :call ToggleQuickfixList()<CR>

" docker file syntax
Plug 'honza/dockerfile.vim'

" sneak
Plug 'justinmk/vim-sneak'

Plug 'glts/vim-textobj-comment'

" support for coffeescript
Plug 'kchmck/vim-coffee-script'

Plug 'kana/vim-textobj-indent'

Plug 'junkblocker/patchreview-vim'

Plug 'codegram/vim-codereview'

Plug 'Valloric/MatchTagAlways'

Plug 'junegunn/goyo.vim'

" vim-scripts repos
Plug 'L9'

" open man pages in vim
runtime ftplugin/man.vim

" allow backspacing over everything in insert mode
set backspace=indent,eol,start

set ruler		" show the cursor position all the time
set showcmd		" display incomplete commands
set incsearch		" do incremental searching

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
  try
    colorscheme monokai
    set cursorline cursorcolumn
  catch /^Vim\%((\a\+)\)\=:E185/
    colorscheme desert 
  endtry
endif

" Switch wrap off for everything
" set nowrap

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

" reload .vimrc
command! Reloadvimrc :so $MYVIMRC
command! Editvimrc :e $MYVIMRC

nnoremap <Leader>tn :tabnew<CR>
nnoremap <Leader>tc :tabclose<CR>
nnoremap <Leader>to :tabonly<CR>
nnoremap <Leader>te :tabedit %<CR>
nnoremap <Leader>tr :Reloadvimrc<CR>
nnoremap ]t :tabNext<CR>
nnoremap [t :tabp<CR>

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
nnoremap ZW :w!<CR>
nnoremap ZA :wall!<CR>

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
nnoremap <C-W>x :only<CR>

" You complete me disabled for tab, only for control space
" let g:ycm_auto_trigger = 0
let g:ycm_key_list_select_completion = ['<C-j>', '<C-Space>']
let g:ycm_key_list_previous_completion = ['<C-k']

" numbers do not show for Control+C, they show only for Esc
map <C-C> w<ESC>

" Required:
filetype plugin indent on

" If there are uninstalled bundles found on startup,
" this will conveniently prompt you to install them.
" NeoBundleCheck

" Map F2 to toggle paste
nnoremap <F7> <C-c>:set paste<CR>i
" set paste on insert and nopaste on exit
" autocmd InsertEnter * :set paste
autocmd InsertLeave * :set nopaste

" Map command W to write with sudo
command! W  write !sudo tee %
command! Q  quitall

" added easy jump to next and previous paragraps
noremap <Leader>} }}(
noremap <Leader>{ {{)

" Enable mouse use in all modes
set mouse=a

"be lazy
set lazyredraw

" autosave
set updatetime=1000
autocmd BufLeave * update
" autocmd CursorHold * update
autocmd InsertLeave * update

call plug#end()
