# ssh
alias sshalaveteli='ssh alaveteli'

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
alias gitresethard='git reset --hard'
alias gitremotev='git remote -v'
alias gitlogallgraphonelindecoratesource='git log --all --graph --oneline --decorate --source'
alias gitresethard='git reset --hard'
alias gitinit='git init'
alias gitcheckoutmaster='git checkout master'
alias gitpush='git push'
alias gitpullall='git pull --all'
alias gitbranch='git branch'
alias gitbrancha='git branch -a'
alias yankgitbranch="git branch | sed -n '/\* /s///p' | xclip -sel clip"
gitcommitam() {
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
