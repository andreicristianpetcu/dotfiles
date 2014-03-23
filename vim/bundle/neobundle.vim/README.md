[![Stories in Ready](https://badge.waffle.io/Shougo/neobundle.vim.png)](https://waffle.io/Shougo/neobundle.vim)

## About

NeoBundle is a next generation Vim plugin manager. This plugin is based on
Vundle(https://github.com/gmarik/vundle), but I renamed and added tons of
features,  while Vundle tends to stay simple.

Requirements:
* Vim 7.2.051 or above.
* "git" command in $PATH(if you want to install github or vim.org plugins)

Recommends:
* vimproc(if you want to install/update asynchronously)
https://github.com/Shougo/vimproc.vim

Note: Neobundle is not stable plugin manager.  If you want to stable plugin
manager, you should use Vundle plugin.  It is well works widely and more
tested.  If you want to use extended features, you can use neobundle.

Vundle features : Stable, simple, good for beginners
neobundle features : Early development(may break compatibility), very complex,
good for plugin power users(for example, 50+ plugins and over 1000 lines
.vimrc, ...)

## How it works

Plugins are defined in NeoBundle by calling `NeoBundle '<plugin repository
location>'`.  NeoBundle assumes Github as the default location for plugins, so
for most plugins you can simply use `NeoBundle 'username/plugin'` rather than
using the absolute URL of the plugin.  These calls should be made in your
.vimrc file.  Once you have defined these, you must call `NeoBundleInstall`,
and NeoBundle will clone all of the repos into the desired folder (generally
`~/.vim/bundle`) and load them into Vim.  If you want to update these
repositories, simply call `NeoBundleUpdate`.

A few other useful commands:
- `:NeoBundleList`          - list configured bundles
- `:NeoBundleInstall(!)`    - install(update) bundles
- `:NeoBundleClean(!)`      - confirm(or auto-approve) removal of unused bundles

Refer to `:help neobundle` for more examples and for a full list of commands.

## Quick start

1. Setup NeoBundle:

     ```
     $ mkdir -p ~/.vim/bundle
     $ git clone https://github.com/Shougo/neobundle.vim ~/.vim/bundle/neobundle.vim
     ```

2. Configure bundles:

     Sample `.vimrc`:

     ```vim
     if has('vim_starting')
       set nocompatible               " Be iMproved

       " Required:
       set runtimepath+=~/.vim/bundle/neobundle.vim/
     endif

     " Required:
     call neobundle#rc(expand('~/.vim/bundle/'))

     " Let NeoBundle manage NeoBundle
     " Required:
     NeoBundleFetch 'Shougo/neobundle.vim'

     " My Bundles here:
     NeoBundle 'Shougo/neosnippet.vim'
     NeoBundle 'Shougo/neosnippet-snippets'
     NeoBundle 'tpope/vim-fugitive'
     NeoBundle 'kien/ctrlp.vim'
     NeoBundle 'flazz/vim-colorschemes'

     " You can specify revision/branch/tag.
     NeoBundle 'Shougo/vimshell', { 'rev' : '3787e5' }

     " Required:
     filetype plugin indent on

     " If there are uninstalled bundles found on startup,
     " this will conveniently prompt you to install them.
     NeoBundleCheck
     ```
3. Install configured bundles:

     Launch `vim`, run `:NeoBundleInstall`, or `:Unite neobundle/install`(required unite.vim)

     Or Command run `bin/neoinstall`

## Advantages over Vundle

1. Plugin prefixed command name(:Bundle vs :NeoBundle).
2. Support for vimproc(asynchronous update/install).
3. Support for unite.vim interface(update/install/search).
4. Support for revision locking.
5. Support for multiple version control systems (Subversion/Git).
6. Support for lazy initialization for optimizing startup time.
7. and so on...

## Tips

If you use a single .vimrc across systems where build programs are
named differently (e.g. GNU Make is often `gmake` on non-GNU
systems), the following pattern is useful:

```vim
let g:make = 'gmake'
if system('uname -o') =~ '^GNU/'
        let g:make = 'make'
endif
NeoBundle 'Shougo/vimproc.vim', {'build': {'unix': g:make}}
```
