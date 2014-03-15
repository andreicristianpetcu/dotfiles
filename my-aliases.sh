# ssh
alias sshalaveteli='ssh alaveteli'

# common
alias ping8888='ping 8.8.8.8'
alias emacsnw='emacs -nw'
alias lsla='ls -la'
alias tigall='tig --all'
axgrep() {
  ps -ax|grep $1
}
historygrep() {
  history|grep $1
}
mkdircd() {
  mkdir $1
  cd $1
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
alias gitpushoriginmaster='git push origin master'
alias gitpush2='git push gitorious master && git push github master'
alias gitstatus='git status'
alias gitpulloriginmaster='git pull origin master'
alias gitresethard='git reset --hard'
alias gitremotev='git remote -v'
alias gitlogallgraphpretty='git log --all --graph --pretty'
gitcommitm() {
    git commit -m "$1"
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
alias vimgitconfig='vim ~/.gitconfig'
alias vimsshconfig='vim ~/.ssh/config'
# functions
psax() {
  ps -ax|grep $1
}

# Vagrant urls
export centos6url="https://github.com/2creatives/vagrant-centos/releases/download/v6.5.1/centos65-x86_64-20131205.box"
