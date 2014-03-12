# ssh
alias sshalaveteli='ssh alaveteli'

# common
alias ping8888='ping 8.8.8.8'
alias emacsnw='emacs -nw'
alias lsla='ls -la'
# pacman
alias pacmansyu='sudo pacman -Syu'        # Synchronize with repositories and then upgrade packages that are out of date on the local system.

# git
alias gitadd='git add . --all'
alias gitpushoriginmaster='git push origin master'
alias gitpush2='git push gitorious master && git push github master'
alias gitstatus='git status'
alias gitpulloriginmaster='git pull origin master'

# vagrant
alias vagrantboxlist='vagrant box list'
alias vagrantsuspend='vagrant suspend'
alias vagrantresume='vagrant resume'
alias vagrantup='vagrant up'
alias vagrantssh='vagrant ssh'
alias vagrantreloadprovision='vagrant reload --provision'

# rails
alias railsc='rails c'
alias railsdb='rails db'
alias railss='rails s'

# rake
alias rakedbmigrate='rake db:migrate'
alias rakedbreset='rake db:reset'

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

# functions
psax() {
  ps -ax|grep $1
}
