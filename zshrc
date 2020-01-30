# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block, everything else may go below.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

if [ -f $HOME/.shell_variables.sh ]; then source $HOME/.shell_variables.sh ;fi

ZSH=$HOME/.oh-my-zsh
DEFAULT_USER="andrei"
DISABLE_AUTO_UPDATE="true"
# DISABLE_LS_COLORS="true"
HISTSIZE=5000 # session history size
SAVEHIST=1000 # saved history

ZSH_THEME=powerlevel9k/powerlevel9k

# ignore duplicates in history
setopt HIST_IGNORE_DUPS
setopt INC_APPEND_HISTORY
setopt SHARE_HISTORY
setopt HIST_EXPIRE_DUPS_FIRST
setopt HIST_IGNORE_ALL_DUPS
setopt HIST_SAVE_NO_DUPS

plugins=(command-not-found cp mvn systemd vagrant common-aliases dnf fasd git gradle cargo colorize docker
    frontend-search colorize git-auto-fetch helm kube-ps1 kubectl ng)

PROMPT=$PROMPT'$(kube_ps1)'

if [ -f $HOME/.profile.sh ]
then
  source $HOME/.profile.sh
fi

if [ "$CONN" != "" ] && [ $CONN = "sshd" ]; then
  ZSH_THEME="clean"
fi

export TERM='xterm-256color'

if [ -f $ZSH/oh-my-zsh.sh ]
then
  source $ZSH/oh-my-zsh.sh
fi

if [ -f $HOME/.my-aliases.sh ]
then
  source $HOME/.my-aliases.sh
fi

# Autocomplete with double tab like bash

setopt bash_autolist

if [ -f /usr/share/zsh/site-contrib/powerline.zsh ]
then
  . /usr/share/zsh/site-contrib/powerline.zsh
fi

if [ -f ~/.shell_promptline.sh ]; then source ~/.shell_promptline.sh ;fi
if [ $commands[kubectl] ]; then source <(kubectl completion zsh); fi

if [ $USER = "root" ]; then
  if [ -f /root/.shell_promptline_root.sh ]; then source /root/.shell_promptline_root.sh ;fi
fi

if [ "$CONN" != "" ] && [ $CONN = "sshd" ]; then
  ZSH_THEME="clean"
  if [ -f ~/.shell_promptline_remote.sh ]; then source ~/.shell_promptline_remote.sh ;fi
fi

if [ -f $HOME/.fzf.zsh ]; then source $HOME/.fzf.zsh ;fi
zmodload -i zsh/parameter
insert-last-command-output() {
  LBUFFER+="$(eval $history[$((HISTCMD-1))])"
}
zle -N insert-last-command-output

# if [ -d $HOME/.zsh ]
# then
#   source $HOME/.zsh/tmux_autocomplete.sh
# fi

bindkey "^X^L" insert-last-command-output

if [ $TILIX_ID ] || [ $VTE_VERSION ]; then
    if [ -f /etc/profile.d/vte.sh ]; then source /etc/profile.d/vte.sh ;fi
    if [ -f /etc/profile.d/vte-2.91.sh ]; then source /etc/profile.d/vte-2.91.sh ;fi
fi

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
