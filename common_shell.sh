# lazy add local bin
LOCAL_BIN="$HOME/.local/bin/"
if [ -d $LOCAL_BIN ]; then export PATH="$PATH:$LOCAL_BIN" ;fi

# lazy add chromium
if [ -f /usr/bin/chromium ]; then export CHROME_BIN='/usr/bin/chromium' ;fi
if [ -f /usr/bin/chromium-browser ]; then export CHROME_BIN='/usr/bin/chromium-browser' ;fi

# lazy add JAVA_HOME
if [ -d /usr/lib/jvm/java-7-openjdk ]; then export JAVA_HOME='/usr/lib/jvm/java-7-openjdk' ;fi
if [ -d /usr/lib/jvm/java-7-oracle/jre ]; then export JAVA_HOME='/usr/lib/jvm/java-7-oracle/jre' ;fi
if [ -d /usr/lib/jvm/java-8-oracle/jre ]; then export JAVA_HOME='/usr/lib/jvm/java-8-oracle/jre' ;fi

# lazy add M2_HOME
if [ -d /opt/maven ]; then export M2_HOME='/opt/maven' ;fi
if [ -d /usr/share/maven ]; then export M2_HOME='/usr/share/maven' ;fi


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
