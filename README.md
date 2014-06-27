# Andrei Cristian Petcu's Dot Files

These are config files to set up a system the way I like it. It now uses [Oh My ZSH](https://github.com/robbyrussell/oh-my-zsh). My configuration is based on [Ryan Bates's ](https://github.com/ryanb/dotfiles).
I am running on Arch Linux, but it will likely work on other GNU/Linux distros as well.


## Installation

Run the following commands in your terminal. It will prompt you before it does anything destructive. Check out the [Rakefile](https://github.com/andreicristianpetcu/dotfiles/blob/custom-bash-zsh/Rakefile) to see exactly what it does.

```sh
install git ruby rake vim zsh exuberant-ctags lua50 tmux
cd ~
git clone https://github.com/andreicristianpetcu/dotfiles.git
cd ~/dotfiles
wget --no-check-certificate http://install.ohmyz.sh -O - | sh
rake install
mkdir -p ~/.vim/bundle
git clone https://github.com/Shougo/neobundle.vim ~/.vim/bundle/neobundle.vim
```

After installing, open a new terminal window to see the effects.

Feel free to customize the .zshrc file to match your preference.


## Features

Many of the following features are added through the "rbates" Oh My ZSH plugin.

I normally place all of my coding projects in ~/code, so this directory can easily be accessed (and tab completed) with the "c" command.

```sh
c railsca<tab>
```

There is also an "h" command which behaves similar, but acts on the home path.

```sh
h doc<tab>
```

Tab completion is also added to rake and cap commands:

```sh
rake db:mi<tab>
cap de<tab>
```

To speed things up, the results are cached in local .rake_tasks~ and .cap_tasks~. It is smart enough to expire the cache automatically in most cases, but you can simply remove the files to flush the cache.

If you're using git, you'll notice the current branch name shows up in the prompt while in a git repository.

There are several features enabled in Ruby's irb including history and completion. Many convenience methods are added as well such as "ri" which can be used to get inline documentation in IRB. See irbrc file for details.


## Uninstall

To remove the dotfile configs, run the following commands. Be certain to double check the contents of the files before removing so you don't lose custom settings.

```sh
unlink ~/.bin
unlink ~/.gitignore
unlink ~/.gemrc
unlink ~/.gvimrc
unlink ~/.irbrc
unlink ~/.vim
unlink ~/.vimrc
rm ~/.zshrc # careful here
rm ~/.gitconfig
rm -rf ~/.dotfiles
rm -rf ~/.oh-my-zsh
chsh -s /bin/bash # change back to Bash if you want
```

Then open a new terminal window to see the effects.
