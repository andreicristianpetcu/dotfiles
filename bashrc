#
# ~/.bashrc
#

if [ -f /etc/bashrc ]; then
  . /etc/bashrc 
fi

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

alias ls='ls --color=auto'
PS1='[\u@\h \W]\$ '

# no duplicate entries
export HISTCONTROL=ignoreboth:erasedups
# append history file
shopt -s histappend
# update histfile after every command
export PROMPT_COMMAND="history -a"

# if [ -f /usr/bin/virtualenvwrapper.sh ]
# then
# 	export WORKON_HOME=~/.virtualenvs
# 	source /usr/bin/virtualenvwrapper.sh
# fi
#
if [ -d $HOME/.local/bin/ ]; then PATH=$PATH:$HOME/.local/bin/ ;fi
if [ -f /etc/profile.d/autojump.bash ]; then source /etc/profile.d/autojump.bash ;fi
if [ -f /usr/share/autojump/autojump.bash ]; then source /usr/share/autojump/autojump.bash ;fi
if [ -f ~/.shell_promptline.sh ]; then source ~/.shell_promptline.sh ;fi
if [ -f $HOME/.autojump/bin/autojump.bash ]; then source $HOME/.autojump/bin/autojump.bash ;fi

if [ $USER = "root" ]; then
  if [ -f /root/.shell_promptline_root.sh ]; then source /root/.shell_promptline_root.sh ;fi
fi

if [ -f $HOME/.fzf.bash ]; then source $HOME/.fzf.bash ;fi

#THIS MUST BE AT THE END OF THE FILE FOR SDKMAN TO WORK!!!
export SDKMAN_DIR="/home/andreip/.sdkman"
[[ -s "/home/andreip/.sdkman/bin/sdkman-init.sh" ]] && source "/home/andreip/.sdkman/bin/sdkman-init.sh"
