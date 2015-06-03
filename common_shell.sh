# Set my editor and git editor
export EDITOR="vim"
export GIT_EDITOR='vim'

# ssh connection check
if [[ -z "$CONN" ]]; then
  export CONN=`cat /proc/$PPID/status | head -1 | cut -f2`
fi

# lazy add local bin
LOCAL_BIN="$HOME/.local/bin"
if [ -d $LOCAL_BIN ]; then export PATH="$PATH:$LOCAL_BIN" ;fi

# lazy add chromium
if [ -f /usr/bin/chromium ]; then export CHROME_BIN='/usr/bin/chromium' ;fi
if [ -f /usr/bin/google-chrome ]; then export CHROME_BIN='/usr/bin/google-chrome' ;fi
if [ -f /usr/bin/chromium-browser ]; then export CHROME_BIN='/usr/bin/chromium-browser' ;fi

if [ -f /usr/bin/firefox ]; then export FIREFOX_BIN='/usr/bin/firefox' ;fi

# lazy add JAVA_HOME
if [ -d /usr/lib/jvm/java-7-openjdk ]; then export JAVA_HOME='/usr/lib/jvm/java-7-openjdk' ;fi
if [ -d /usr/lib/jvm/java-7-oracle/jre ]; then export JAVA_HOME='/usr/lib/jvm/java-7-oracle/jre' ;fi
if [ -d /usr/lib/jvm/java-8-oracle ]; then export JAVA_HOME='/usr/lib/jvm/java-8-oracle' ;fi
if [ -d /usr/lib/jvm/oraclejdk8-64 ]; then export JAVA_HOME='/usr/lib/jvm/oraclejdk8-64' ;fi
if [ -n "$JAVA_HOME" ]; then export PATH="$JAVA_HOME/bin:$PATH" ;fi

# lazy add M2_HOME
if [ -d /opt/maven ]; then export M2_HOME='/opt/maven' ;fi
if [ -d /usr/share/maven ]; then export M2_HOME='/usr/share/maven' ;fi
if [ -n $M2_HOME ]; then export PATH="$M2_HOME/bin:$PATH" ;fi

# ruby version management with rbenv
RBENV_ROOT="$HOME/.rbenv"
if [ -d $RBENV_ROOT ]; then
  export PATH="$RBENV_ROOT/bin:$PATH"
  eval "$(rbenv init -)"
fi

# ndenv variable
NDENV_HOME="$HOME/.ndenv"
if [ -d $NDENV_HOME ]; then
  export PATH="$NDENV_HOME/bin:$PATH"
  eval "$(ndenv init -)"
fi
if [ -d $HOME/.local/lib/node_modules ]; then
  export NODE_PATH=$NODE_PATH:$HOME/.local/lib/node_modules
fi

export GOPATH=~/Dev/go
if [ -d $GOPATH ]; then
  export PATH=$PATH:~/Dev/go/bin
fi

# jenv settings
if [ -f $HOME/.jenv/bin/jenv-init.sh ]; then
  source $HOME/.jenv/bin/jenv-init.sh
fi

# add aliases to both shells
# source $HOME/.my-aliases.sh

if [ -f $HOME/.common_shell.local.sh ]; then
  source $HOME/.common_shell.local.sh
fi

if [ -d $HOME/.pyenv/bin ]; then
  export PATH="$HOME/.pyenv/bin:$PATH"
  eval "$(pyenv init -)"
  eval "$(pyenv virtualenv-init -)"
fi 

if [ -d "$HOME/dotfiles/bin" ]; then
  export PATH="$PATH:$HOME/dotfiles/bin"
fi

export FZF_DEFAULT_OPTS="+s -e"
