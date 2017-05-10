#!/usr/bin/env bash

if [ -f ~/.bashrc ]; then
  . ~/.bashrc
fi

# Path to the bash it configuration
export BASH_IT=$HOME/.bash_it

# Lock and Load a custom theme file
# location /.bash_it/themes/
export BASH_IT_THEME='bobby'

# Set the path nginx
export NGINX_PATH='/opt/nginx'

# Load Bash It
if [ -f $BASH_IT/bash_it.sh ]; then
  source $BASH_IT/bash_it.sh
fi

source $HOME/.common_shell.sh

#THIS MUST BE AT THE END OF THE FILE FOR SDKMAN TO WORK!!!
export SDKMAN_DIR="/home/andreip/.sdkman"
[[ -s "/home/andreip/.sdkman/bin/sdkman-init.sh" ]] && source "/home/andreip/.sdkman/bin/sdkman-init.sh"
