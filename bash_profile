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
if [ -f $BASH_IT/bash_it.sh ]; then source $BASH_IT/bash_it.sh fi

source ~/.common_shell.sh
