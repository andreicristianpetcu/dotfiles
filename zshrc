ZSH=$HOME/.oh-my-zsh
ZSH_THEME="nebirhos"
ZSH_THEME="agnoster"
ZSH_THEME="sorin"
ZSH_THEME="zhann"
ZSH_THEME="sporty_256"
ZSH_THEME="awesomepanda"
DISABLE_AUTO_UPDATE="true"
# DISABLE_LS_COLORS="true"
DEFAULT_USER="andrei"

plugins=(git gem rails3 ruby archlinux common-aliases )

export PATH="/usr/local/bin:$PATH"
export EDITOR='vim'

export TERM='xterm-256color'

source $ZSH/oh-my-zsh.sh
source $HOME/.my-aliases.sh

# for Homebrew installed rbenv
if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi

PATH=$PATH:$HOME/.rvm/bin # Add RVM to PATH for scripting

# add this to ~/.zshenv ??
[[ -s "$HOME/.rvm/scripts/rvm" ]] && . "$HOME/.rvm/scripts/rvm" 
