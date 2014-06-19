# ssh
alias sshalaveteli='ssh alaveteli'
sshcopyidisshidrsapubuserserver(){
  ssh-copy-id -i ~/.ssh/id_rsa_andrei.pub $1
}

# common
alias ping8888='ping 8.8.8.8'
alias emacsnw='emacs -nw'
alias tigall='tig --all'
alias tmux2='tmux -2'
alias tmuxattachtmuxnew='tmux attach || tmux new'
alias installneobundle='rm -rf ~/.vim && mkdir -p ~/.vim/bundle && git clone https://github.com/Shougo/neobundle.vim ~/.vim/bundle/neobundle.vim'
alias execshelll='exec $SHELL -l'
alias yankpwd='echo `pwd` | xclip -sel clip'
alias mvncleaninstall='mvn clean install'
alias dirspv='dirs -pv'
alias shaclip='xclip -o -selection | read line; echo -n $line | openssl sha1 | awk '"'"'{print $2}'"'"' | xclip -sel clip'
alias sudo!!='sudo !!'
alias sudopoweroff='sudo poweroff'
alias sudosu='sudo su'
alias sudosupostgres='sudo su postgres'
alias sudoupostgrescreateusersuserp='sudo -u postgres createuser -s $USER -P'

axgrep() {
  ps -ax|grep $1
}

kill9() {
  kill -9 $1
}

kill15() {
  kill -15 $1
}

historygrep() {
  history|grep $1
}

mkdircd() {
  mkdir $1
  cd $1
}

rmrf() {
  rm -rf $1
}

substringclip(){
  string=`xclip -o -selection`
  echo ${string:0:$1} | xclip -sel clip
}

kill9lsofit(){
  sudo lsof -i:$1
  sudo kill -9 `sudo lsof -i:$1 -t`
}


# pacman
alias pacmansyu='sudo pacman -Syu'        # Synchronize with repositories and then upgrade packages that are out of date on the local system.
pacmans() {
    sudo pacman -S "$1"
}
pacmanrs() {
    sudo pacman -Rs "$1"
}

# git
alias gitadd='git add . --all'
alias gitpush='git push'
alias gitstatus='git status'
alias gitresethardgitcleanfd='git reset --hard && git clean -f -d'
alias gitremotev='git remote -v'
alias gitlogallgraphonelindecoratesource='git log --all --graph --oneline --decorate --source'
alias gitinit='git init'
alias gitcheckoutmaster='git checkout master'
alias gitpush='git push'
alias gitpullall='git pull --all'
alias gitbranch='git branch'
alias gitbrancha='git branch -a'
alias yankgitbranch="git branch | sed -n '/\* /s///p' | xclip -sel clip"
gitcommitam() {
    git add . --all
    git commit -a -m "$1"
}
gitremoterm(){
  git remote rm $1
}
gitremoteadd(){
  git remote add $1 $2
}

# vagrant
alias vagrantboxlist='vagrant box list'
alias vagrantsuspend='vagrant suspend'
alias vagrantresume='vagrant resume'
alias vagrantup='vagrant up'
alias vagrantssh='vagrant ssh'
alias vagrantdestroyf='vagrant destroy -f'
alias vagrantreloadprovision='vagrant reload --provision'
vagrantboxadd(){
    vagrant box add $1 $2
}
vagrantinit(){
    vagrant init $1
}

# rails
alias railsc='rails c'
alias railsdb='rails db'
alias railss='rails s'

# rake
alias rakeinstall='rake install'
alias rakedbmigrate='rake db:migrate'
alias rakedbreset='rake db:reset'
alias rakedbfixturesload='rake db:fixtures:load'

# bundle
alias bundleexecrakedbschemaload='bundle exec rake db:schema:load'
alias bundleinstall='bundle install'
alias bundleinstallnodeployment='bundle install --no-deployment'
alias bundleinstallpathvendorbundle='bundle install --path vendor/bundle'
alias bundlelistpaths='bundle list --paths'
alias ctagsrbundlelistpaths='ctags -R . $(bundle list --paths)'

# rvm
alias rvmlist='rvm list'
alias rvmlistknown='rvm list known'
alias rvminstall='curl -L get.rvm.io | bash -s stable'

# vim
alias vimvimrc='vim ~/.vimrc'
alias vimirbrc='vim ~/.irbrc'
alias vimbashrc='vim ~/.bashrc'
alias vimbashprofile='vim ~/.bash_profile'
alias vimzshrc='vim ~/.zshrc'
alias vimtmuxconf='vim ~/.tmux.conf'
alias vimgemrc='vim ~/.gemrc'
alias vimmyaliasessh='vim ~/.my-aliases.sh'
alias vimcommonshellsh='vim ~/.common_shell.sh'
alias vimgitconfig='vim ~/.gitconfig'
alias vimsshconfig='vim ~/.ssh/config'
alias vimjshintrcjs='vim ~/.jshintrc.js'
alias vimetchosts='vim /etc/hosts'
alias vimetcfstab='vim /etc/fstab'
alias vimrubysnippets='vim ~/.vim/bundle/vim-snippets/snippets/ruby.snippets'
alias vimerubysnippets='vim ~/.vim/bundle/vim-snippets/snippets/eruby.snippets'
alias vimcsssnippets='vim ~/.vim/bundle/vim-snippets/snippets/css.snippets'
alias vimjavascriptsnippets='vim ~/.vim/bundle/vim-snippets/snippets/javascript/javascript.snippets'
alias vimjavascriptsnippets='vim ~/.vim/bundle/vim-snippets/snippets/javascript/javascript-jquery.snippets'
alias vimhtmlsnippets='vim ~/.vim/bundle/vim-snippets/snippets/html.snippets'
alias vimhtmlsminimalnippets='vim ~/.vim/bundle/vim-snippets/snippets/html_minimal.snippets'
# functions
psaxgrep() {
  ps -ax|grep $1
}

# Vagrant urls
export centos6url="https://github.com/2creatives/vagrant-centos/releases/download/v6.5.1/centos65-x86_64-20131205.box"

installjenv(){
  rm -rf "$HOME/.jenv"
  mkdir -p $HOME/.jenv/candidates/java
  curl -L -s get.jenv.io | bash
  source /home/andrei/.jenv/bin/jenv-init.sh
  if [ -d /usr/lib/jvm/java-7-openjdk ]; then ln -s /usr/lib/jvm/java-7-openjdk $HOME/.jenv/candidates/java/java-7-openjdk ;fi
  if [ -d /usr/lib/jvm/java-7-oracle/jre ]; then ln -s /usr/lib/jvm/java-7-oracle/jre $HOME/.jenv/candidates/java/java-7-oracle-jre ;fi
  if [ -d /usr/lib/jvm/java-8-oracle/jre ]; then ln -s /usr/lib/jvm/java-8-oracle/jre $HOME/.jenv/candidates/java/java-8-oracle-jre ;fi
}

installtern(){
  cd ~/.vim/bundle/tern_for_vim
  npm install tern -g
  npm install
}
installjsstuff(){
  npm install taginator -g
  npm install -g git://github.com/ramitos/jsctags.git
}
installzshmarks(){
  cd ~/.oh-my-zsh/custom/plugins
  git clone git://github.com/jocelynmallon/zshmarks.git
}
# Docker
alias dockerbuildtlasttagdockerrunitlasttag='docker build -t lasttag . && docker run -i -t lasttag'
alias systemctlstartdocker='sudo systemctl start docker'
alias dockerimages='docker images'
alias dockerrmdockerpsaq='docker rm $(docker ps -a -q)'
alias dockerstopdockerpsaq='docker stop $(docker ps -a -q)'
alias dockerpsa='docker ps -a'
alias dockerps='docker ps'
alias dockerrmidockerimagesq='docker rmi $(docker images -q)'

sshiinsecure_keyroot(){
  ssh -i ~/.insecure_key root@$1
}
dockerrundyourimagesbinmyinitenableinsecurekey(){
  docker run -d $1 /sbin/my_init --enable-insecure-key
}
dockerinspectidgrepipaddress(){
  docker inspect $1 | grep IPAddress
}
alias dockernosudo='sudo groupadd docker && sudo gpasswd -a ${USERNAME} docker && sudo service docker restart'
