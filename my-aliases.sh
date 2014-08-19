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

findname(){
  find . -name $1
}

aliasgrep(){
  alias | grep $1
}

whencef(){
  whence -f $1
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
alias gitpush2='git push github master && git push gitlab master'
alias gitpullall='git pull --all'
alias gitbranch='git branch'
alias gitbrancha='git branch -a'
alias gitdiffcachedpatch='git diff --cached > ~/patch.txt'
alias yankgitbranch="git branch | sed -n '/\* /s///p' | xclip -sel clip"

gitcommitam() {
    git add . --all
    git commit -a -m "$*"
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
alias vagranthalt='vagrant halt'
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
alias vimshellvariablessh='vim ~/.shell_variables.sh'

# functions
psaxgrep() {
  ps -ax|grep $1
}

# Vagrant urls
export centos6url="https://github.com/2creatives/vagrant-centos/releases/download/v6.5.1/centos65-x86_64-20131205.box"

# install various stuff
alias installpyenv='curl -L https://raw.githubusercontent.com/yyuu/pyenv-installer/master/bin/pyenv-installer | bash'
alias installohmyzsh="rm -rf $HOME/.oh-my-zsh && wget --no-check-certificate http://install.ohmyz.sh -O - | sh"
alias installrbenv='git clone https://github.com/sstephenson/rbenv.git ~/.rbenv'
alias installrubybuild='git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build'
alias installruby='installrbenv && installrubybuild && rbenv install 2.1.0'
alias installfzf='git clone https://github.com/junegunn/fzf.git ~/.fzf && ~/.fzf/install'

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
# create one "lasttag" container. Do I need it?
alias dockerbuildtlasttag='docker build -t lasttag .'
# create one lastag contrainer and runs it. do I need it?
alias dockerbuildtlasttagdockerrunitlasttag='docker build -t lasttag . && docker run -i -t lasttag'
# run last tag. do i need it?
alias dockerrunitdlasttag='docker run -i -t -d lasttag'
alias systemctlstartdocker='sudo systemctl start docker'
alias dockerimages='docker images'
#delete all stopped containers
alias dockerrmdockerpsaq='docker rm $(docker ps -a -q)'
alias dockerstopdockerpsq='docker stop $(docker ps -q)'
alias dockerpsa='docker ps -a'
alias dockerps='docker ps'
alias dockerrmidockerimagesq='docker rmi $(docker images -q)'
alias dockernosudo='sudo groupadd docker && sudo gpasswd -a ${USERNAME} docker && sudo service docker restart'
alias dockerimagesqhead1='docker images -q|head -1'
alias dockerretrylast="dockerstoplast && dockerrunlastimage && sleep 1s && dockersshlast"
#delete all untagged images
alias dockerrmidockerimagesgrepnoneawkprint3="docker rmi $(docker images | grep '^<none>' | awk '{print $3}')"
#cleanpup. delete all stopped containers and remove untagged images
alias dockercleanup="dockerrmdockerpsaq && dockerrmidockerimagesgrepnoneawkprint3"

sshiinsecurekeyroot(){
  ssh-keygen -f "$HOME/.ssh/known_hosts" -R $1
  ssh -i ~/.insecure_key root@$1
}

dockerrundyourimagesbinmyinitenableinsecurekey(){
  docker run -d $1 /sbin/my_init --enable-insecure-key
}

dockerinspectidgrepipaddress(){
  docker inspect $1 | grep IPAddress
}

dockerinspectname(){
  docker inspect $1|grep Name| tr -d ' '| awk -F\" '{print $4}'
}
dockerinspectimage(){
  docker inspect $1|grep Image| head  -1 | tr -d ' '| awk -F\" '{print $4}'
}

dockerinspectipaddress(){
  docker inspect $1|grep IPAddress| tr -d ' '| awk -F\" '{print $4}'
}

dockerrunlastimage(){
  echo "Running `dockerimagesqhead1`"
  docker run -d `dockerimagesqhead1` /sbin/my_init --enable-insecure-key
}

dockerstoplast(){
  docker ps -l
  LAST_CONTAINER="`docker ps -lq`"
  docker stop $LAST_CONTAINER
}

dockersshlast(){
  docker ps -l
  LAST_CONTAINER="`docker ps -lq`"
  CONTAINER_IP=$(docker inspect $LAST_CONTAINER | grep IPAddress| awk '{print $2}'| awk -F\" '{print $2}')
  docker inspect $LAST_CONTAINER | grep Name| tr -d ' '|grep Name
  docker inspect $LAST_CONTAINER | grep Image| head -1| tr -d ' '|grep Image
  docker inspect $LAST_CONTAINER | grep IPAddress| tr -d ' '|grep IPAddress
  ssh-keygen -f "$HOME/.ssh/known_hosts" -R $CONTAINER_IP
  ssh -i ~/.insecure_key root@$CONTAINER_IP
}

dockerlist(){
  echo "IP Address      Container ID    Image ID         Name"
  for cont in $(dockerps -q);
  do 
    echo "`dockerinspectipaddress $cont`     $cont    `dockerinspectimage $cont`     `dockerinspectname $cont`"|grep `dockerinspectipaddress $cont`
  done
  echo "Total containers `dockerps -q| wc -l`"
}

# Licenses
alias licensegpl="wget https://gitlab.com/andreicristianpetcu/dotfiles/raw/master/LICENSE.txt"
alias licenseagpl="wget https://gitlab.com/andreicristianpetcu/alaveteli/raw/master/LICENSE.txt"

# fzf magic
# fe [FUZZY PATTERN] - Open the selected file with the default editor
#   - Bypass fuzzy finder if there's only one match (--select-1)
#   - Exit if there's no match (--exit-0)
fe() {
  local file
  file=$(fzf --query="$1" --select-1 --exit-0)
  [ -n "$file" ] && ${EDITOR:-vim} "$file"
}

# Equivalent to above, but opens it with `open` command
fo() {
  local file
  file=$(fzf --query="$1" --select-1 --exit-0)
  [ -n "$file" ] && open "$file"
}

# fd - cd to selected directory
fd() {
  local dir
  dir=$(find ${1:-*} -path '*/\.*' -prune \
                  -o -type d -print 2> /dev/null | fzf +m) &&
  cd "$dir"
}
# fda - including hidden directories
fda() {
  local dir
  dir=$(find ${1:-.} -type d 2> /dev/null | fzf +m) && cd "$dir"
}
# cdf - cd into the directory of the selected file
cdf() {
   local file
   local dir
   file=$(fzf +m -q "$1") && dir=$(dirname "$file") && cd "$dir"
}
# fkill - kill process
fkill() {
  ps -ef | sed 1d | fzf -m | awk '{print $2}' | xargs kill -${1:-9}
}
# fbr - checkout git branch
fbr() {
  local branches branch
  branches=$(git branch) &&
  branch=$(echo "$branches" | fzf +s +m) &&
  git checkout $(echo "$branch" | sed "s/.* //")
}
# fco - checkout git commit
fco() {
  local commits commit
  commits=$(git log --pretty=oneline --abbrev-commit --reverse) &&
  commit=$(echo "$commits" | fzf +s +m -e) &&
  git checkout $(echo "$commit" | sed "s/ .*//")
}
# ftags - search ctags
ftags() {
  local line
  [ -e tags ] &&
  line=$(
    awk 'BEGIN { FS="\t" } !/^!/ {print toupper($4)"\t"$1"\t"$2"\t"$3}' tags |
    cut -c1-80 | fzf --nth=1,2
  ) && $EDITOR $(cut -f3 <<< "$line") -c "set nocst" \
                                      -c "silent tag $(cut -f2 <<< "$line")"
}
