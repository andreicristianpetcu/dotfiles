ZSH=$HOME/.oh-my-zsh
DEFAULT_USER="andrei"
DISABLE_AUTO_UPDATE="true"
# DISABLE_LS_COLORS="true"

ZSH_THEME="awesomepanda"

plugins=(git git-extras svn gem rails ruby archlinux common-aliases gradle bower debian docker mvn node npm pip pyenv python systemd vagrant web-search tmux)

export PATH="/usr/local/bin:$PATH"
export EDITOR='vim'
if [ -d ~/.local/bin/ ]; then PATH=$PATH:~/.local/bin/ ;fi

export TERM='xterm-256color'

source $ZSH/oh-my-zsh.sh
source $HOME/.my-aliases.sh

# for Homebrew installed rbenv
if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi

setopt bash_autolist

if [ -f /usr/share/zsh/site-contrib/powerline.zsh ]
then
  . /usr/share/zsh/site-contrib/powerline.zsh
fi
export ZSH_TMUX_AUTOSTART='true'
export ZSH_TMUX_AUTOCONNECT='true'
if [ "$TMUX" = "" ]; then 
  tmux attach || tmux new
  # tmux -2; 
fi
