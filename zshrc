ZSH=$HOME/.oh-my-zsh
DEFAULT_USER="andrei"
DISABLE_AUTO_UPDATE="true"
# DISABLE_LS_COLORS="true"
HISTSIZE=5000 # session history size
SAVEHIST=1000 # saved history

ZSH_THEME="awesomepanda"

plugins=(git git-extras svn gem rails ruby archlinux common-aliases gradle bower debian docker mvn node npm pip pyenv python systemd vagrant web-search tmux heroku)

export PATH="/usr/local/bin:$PATH"
export EDITOR='vim'

# ssh connection check
export CONN=`cat /proc/$PPID/status | head -1 | cut -f2`

# lazy add local bin
if [ -d ~/.local/bin ]; then PATH=$PATH:~/.local/bin ;fi
# lazy add chromium
if [ -f /usr/bin/chromium ]; then export CHROME_BIN='/usr/bin/chromium' ;fi
if [ -f /usr/bin/chromium-browser ]; then export CHROME_BIN='/usr/bin/chromium-browser' ;fi

# lazy add JAVA_HOME
if [ -d /usr/lib/jvm/java-7-openjdk ]; then export JAVA_HOME='/usr/lib/jvm/java-7-openjdk' ;fi
if [ -d /usr/lib/jvm/java-7-oracle/jre ]; then export JAVA_HOME='/usr/lib/jvm/java-7-oracle/jre' ;fi

# lazy add M2_HOME
if [ -d /opt/maven ]; then export M2_HOME='/opt/maven' ;fi
if [ -d /usr/share/maven ]; then export M2_HOME='/usr/share/maven' ;fi

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
