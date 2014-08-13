ZSH=$HOME/.oh-my-zsh
DEFAULT_USER="andrei"
DISABLE_AUTO_UPDATE="true"
# DISABLE_LS_COLORS="true"
HISTSIZE=5000 # session history size
SAVEHIST=1000 # saved history

ZSH_THEME="awesomepanda"

# ignore duplicates in history
setopt HIST_IGNORE_DUPS

plugins=(archlinux bower command-not-found cp docker gem git git-extras
      \ gitignore gradle heroku history-substring-search jsontools mvn node
      \ npm pip pyenv python rails rbenv rsync ruby sudo svn systemadmin
      \ systemd tmux vagrant web-search zsh_reload zshmarks)

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
if [ -f $HOME/.fzf.zsh ]; then source $HOME/.fzf.zsh ;fi
