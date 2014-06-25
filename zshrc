ZSH=$HOME/.oh-my-zsh
DEFAULT_USER="andrei"
DISABLE_AUTO_UPDATE="true"
# DISABLE_LS_COLORS="true"
HISTSIZE=5000 # session history size
SAVEHIST=1000 # saved history

ZSH_THEME="awesomepanda"

plugins=(git git-extras svn gem rails ruby archlinux gradle bower docker mvn node npm pip pyenv python systemd vagrant web-search tmux heroku zshmarks command-not-found cp git-extras gitignore history-substring-search jsontools pyenv rbenv rsync zsh_reload web-search systemadmin sudo)

source ~/.common_shell.sh
if [ $CONN = "sshd" ]; then ZSH_THEME="clean" ;fi

export TERM='xterm-256color'

source $ZSH/oh-my-zsh.sh
source $HOME/.my-aliases.sh

# Autocomplete with double tab like bash

setopt bash_autolist

if [ -f /usr/share/zsh/site-contrib/powerline.zsh ]
then
  . /usr/share/zsh/site-contrib/powerline.zsh
fi
export ZSH_TMUX_AUTOSTART='true'
export ZSH_TMUX_AUTOCONNECT='true'
if [ "$TMUX" = "" ] && [ $CONN != "sshd" ]; then 
  tmux attach || tmux new
fi
if [ -f /etc/profile.d/autojump.zsh ]; then source /etc/profile.d/autojump.zsh ;fi
if [ -f /usr/share/autojump/autojump.zsh ]; then source /usr/share/autojump/autojump.zsh ;fi
if [ -f /usr/share/zsh/site-contrib/powerline.zsh ]; then source /usr/share/zsh/site-contrib/powerline.zsh ;fi
