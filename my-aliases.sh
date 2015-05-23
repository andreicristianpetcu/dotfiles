# ssh
alias sshalaveteli='ssh alaveteli'
sshcopyidisshidrsapubuserserver(){
  ssh-copy-id -i ~/.ssh/id_rsa_andrei.pub $1
}
alias sshoitmuxmongo='ssh oi -L 37017:donoratainstanta:27017 -t "command; tmux attach || tmux new"'

# Arch GNU/Linux
alias archupdate='sudo aura -Syu --noconfirm && sudo aura -Ayu --noconfirm'

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

installrootdotfiles(){
  sudo rm -rf /root/.shell_promptline.sh
  sudo cp $HOME/.shell_promptline.sh /root/.shell_promptline.sh
  sudo rm -rf /root/.shell_promptline_root.sh
  sudo cp $HOME/.shell_promptline_root.sh /root/.shell_promptline_root.sh
  sudo rm -rf /root/.bashrc
  sudo cp $HOME/.bashrc /root/.bashrc
  sudo rm -rf /root/.zshrc
  sudo cp $HOME/.zshrc /root/.zshrc
}

tmuxlocal(){                                                                                                                                                                                                
  echo "unbind C-b
set -g prefix C-q
bind C-q send-prefix" > ~/.tmux.conf.local
}

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

#sample usage
#countsimilar "\w+::\w+\s*"
#countsimilar "#include <.*>"
#countsimilar "#include <\w*?/"
countsimilar(){
  egrep -roh "$1" .| sort | uniq -c| cut -c-100 | sort -k1,1nr -k2,2 | head -n 100 | egrep --color=auto "$1"
}

# desktop
installgnomekeys(){
  gsettings set org.gnome.desktop.wm.keybindings move-to-workspace-down "['<Control><Shift><Alt>j', '<Control><Shift><Alt>Down']"
  gsettings set org.gnome.desktop.wm.keybindings move-to-workspace-up "['<Control><Shift><Alt>k', '<Control><Shift><Alt>Up']"
  gsettings set org.gnome.desktop.wm.keybindings switch-to-workspace-down "['<Control><Alt>j', '<Control><Alt>Down']"
  gsettings set org.gnome.desktop.wm.keybindings switch-to-workspace-up "['<Control><Alt>k', '<Control><Alt>Up']"
  gsettings set org.gnome.desktop.wm.keybindings move-to-workspace-right "['<Control><Shift><Alt>l', '<Control><Shift><Alt>Right']"
  gsettings set org.gnome.desktop.wm.keybindings move-to-workspace-left "['<Control><Shift><Alt>h', '<Control><Shift><Alt>Left']"
  gsettings set org.gnome.desktop.wm.keybindings switch-to-workspace-right "['<Control><Alt>l', '<Control><Alt>Right']"
  gsettings set org.gnome.desktop.wm.keybindings switch-to-workspace-left "['<Control><Alt>h', '<Control><Alt>Left']"
}

saveguakesettings(){
  gconftool-2 --dump /apps/guake > $HOME/.gconftool2_guake.xml
}

loadguakesettings(){
  gconftool-2 --load $HOME/.gconftool2_guake.xml
}

alias listkeysworkspace="gsettings list-recursively org.gnome.desktop.wm.keybindings | grep workspace"

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
alias gitpushgitorious='git push gitorious --all'
alias gitpushgitlab='git push gitlab --all'
alias gitpushgithub='git push github --all'
alias gitstatus='git status'
alias gitresethardgitcleanfd='git reset --hard && git clean -f -d'
alias gitremotev='git remote -v'
alias gitlogallgraphonelindecoratesource='git log --all --graph --oneline --decorate --source'
alias gitinit='git init'
alias gitcheckoutmaster='git checkout master'
alias gitpushall='for remote in `git remote|grep -E lab\|hub\|origin`; do git push $remote --all; done'
alias gitpullall='git pull --all'
alias gitbranch='git branch'
alias gitbrancha='git branch -a'
alias gitdiffcachedpatch='git diff --cached > ~/patch.txt'
#get git root directory
alias gitpwd='git rev-parse --show-toplevel'
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
alias vimcommonshelllocalsh='vim ~/.common_shell.local.sh'
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
alias vimcvimfilerdouble='vim -c "VimFilerDouble"'
alias vimcpluginstallqall='vim -c "PlugInstall|qall!"'
alias vimclean='rm -rf ~/.vim/autoload && rm -rf ~/.vim/bundle && rm -rf ~/.vim/colour && rm -rf ~/.vim/tmp'

hosttoip(){
  sudo sed -i "/$1/d" /etc/hosts
  echo "$2 $1" | sudo tee -a /etc/hosts
}

# functions
psaxgrep() {
  ps -ax|grep $1
}

# Vagrant urls
export centos6url="https://github.com/2creatives/vagrant-centos/releases/download/v6.5.1/centos65-x86_64-20131205.box"

# install various stuff
alias installpuppetdev="sudo puppet apply -v ~/.puppet_dev.pp"
alias installpyenv='curl -L https://raw.githubusercontent.com/yyuu/pyenv-installer/master/bin/pyenv-installer | bash'
alias installohmyzsh="rm -rf $HOME/.oh-my-zsh && wget --no-check-certificate http://install.ohmyz.sh -O - | sh"
alias installrbenv='rm -rf ~/.rbenv && git clone https://github.com/sstephenson/rbenv.git ~/.rbenv'
alias installndenv='rm -rf ~/.ndenv && git clone https://github.com/riywo/ndenv ~/.ndenv && git clone https://github.com/riywo/node-build.git ~/.ndenv/plugins/node-build'
alias installrubybuild='git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build'
alias installruby='installrbenv && installrubybuild && rbenv install 2.1.0'
alias installfzf='rm -rf ~/.fzf && git clone https://github.com/junegunn/fzf.git ~/.fzf && ~/.fzf/install'
alias refreshrbenv="cd $HOME/.rbenv/plugins/ruby-build && git pull && cd $HOME/dotfiles && rbenv install && rbenv rehash"
alias installvagrantguestaditions="vagrant plugin install vagrant-vbguest"
alias bowerinstalloffline="bower install --offline"
alias npminstallcachemin999999="npm install --cache-min 999999"
alias installgdbpp="rm -rf ~/.libstdc--v3python && git clone https://github.com/andreicristianpetcu/libstdc--v3python ~/.libstdc--v3python"
alias installboostprettyprint="rm -rf ~/.Boost-Pretty-Printer.git && git clone https://github.com/mateidavid/Boost-Pretty-Printer.git ~/.Boost-Pretty-Printer.git"

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

npminstallglobals(){
 npm install -g grunt-cli bower karma karma-firefox-launcher karma-chrome-launcher http-server
}

starthttpserver(){
  http-server -p 7080
}

installzshmarks(){
  cd ~/.oh-my-zsh/custom/plugins
  git clone git://github.com/jocelynmallon/zshmarks.git
}

# Docker
alias dobuild='docker build .'
alias dobuildrunlastimage='docker build . && docker run -d `docker images -q|head -1`'
alias dorestart='sudo systemctl start docker'
alias doimages='docker images'
#delete all stopped containers
alias dormall='docker rm $(docker ps -a -q)'
alias dostopall='docker stop $(docker ps -q)'
alias dopsa='docker ps -a'
alias dops='docker ps'
alias dormiall='docker rmi `docker images -q`'
alias donosudo='sudo groupadd docker ; usermod -a -G docker ${USERNAME} ; sudo gpasswd -a ${USERNAME} docker ; sudo service docker restart'
alias dolastimage='docker images -q|head -1'
alias dostoplast='docker stop `docker ps -q|head -1`'
alias doimagesqhead1='docker images -q|head -1'
# alias dorunlastimage='docker run -d `docker images -q|head -1`'
alias doretrylast="dostoplast && dorunlastimage && sleep 1s && dosshlast"
#delete all untagged images
alias docleanintermediary="docker rmi $(docker images | grep '^<none>' | awk '{print $3}')"
#cleanpup. delete all stopped containers and remove untagged images
alias docleanall="dormall ; dormiall"

alias bleachbitcleanall="bleachbit -c firefox.cache && bleachbit -c chromium.cache && bleachbit -c google_chrome.cache && bleachbit -c thumbnails.cache \
  && bleachbit -c deepscan.thumbs_db"

alias cleanall="sudo aura -Cc && bleachbitcleanall"

dormunused(){
  docker rm $(docker ps -f status=exited -q)
}

sshinsecuretest(){
  ssh-keygen -f "$HOME/.ssh/known_hosts" -R $1
  ssh -i ~/.insecure_key root@$1
}

dockerrundyourimagesbinmyinitenableinsecurekey(){
  docker run -d $1 /sbin/my_init --enable-insecure-key
}

dockerinspectidgrepipaddress(){
  docker inspect $1 | grep IPAddress
}

doinspectname(){
  docker inspect $1|grep Name| tr -d ' '| awk -F\" '{print $4}'
}
doinspectimage(){
  docker inspect $1|grep Image| head  -1 | tr -d ' '| awk -F\" '{print $4}'
}

doinspectipaddress(){
  docker inspect $1|grep IPAddress| tr -d ' '| awk -F\" '{print $4}'
}

dorunlastimage(){
  echo "Running `doimagesqhead1`"
  docker run -d -v /mnt/docker_volume:/mnt/parent_directory `doimagesqhead1` /sbin/my_init --enable-insecure-key
}

dosshlast(){
  docker ps -l
  LAST_CONTAINER="`docker ps -lq`"
  CONTAINER_IP=$(docker inspect $LAST_CONTAINER | grep IPAddress| awk '{print $2}'| awk -F\" '{print $2}')
  docker inspect $LAST_CONTAINER | grep Name| tr -d ' '|grep Name
  docker inspect $LAST_CONTAINER | grep Image| head -1| tr -d ' '|grep Image
  docker inspect $LAST_CONTAINER | grep IPAddress| tr -d ' '|grep IPAddress
  ssh-keygen -f "$HOME/.ssh/known_hosts" -R $CONTAINER_IP
  ssh -i ~/.insecure_key root@$CONTAINER_IP
}

dolist(){
  echo "IP Address      Container ID    Image ID         Name"
  for cont in $(docker ps -q);
  do 
    echo "`doinspectipaddress $cont`     $cont    `doinspectimage $cont`     `doinspectname $cont`"|grep `doinspectipaddress $cont`
  done
  echo "Total containers `docker ps -q| wc -l`"
}

# Licenses
alias licensegpl="wget https://gitlab.com/andreicristianpetcu/dotfiles/raw/master/LICENSE.txt"
alias licenseagpl="wget https://gitorious.org/tribunal/tribunal/raw/LICENSE.txt"
alias licenseccbysa40="wget https://creativecommons.org/licenses/by-sa/4.0/legalcode.txt -O LICENSE.txt"

# fzf magic
# fe [FUZZY PATTERN] - Open the selected file with the default editor
#   - Bypass fuzzy finder if there's only one match (--select-1)
#   - Exit if there's no match (--exit-0)
fed() {
  local file
  file=$(fzf --query="$1" --select-1 --exit-0)
  [ -n "$file" ] && ${EDITOR:-vim} "$file"
}
bindkey -s '^V' '^qfed\n'

# fzf magic
# fe [FUZZY PATTERN] - Delete selected file or directory
#   - Bypass fuzzy finder if there's only one match (--select-1)
#   - Exit if there's no match (--exit-0)
frmf() {
  local file
  file=$(fzf --query="$1" --select-1 --exit-0)
  [ -n "$file" ] && rm -rf "$file"
}

# Equivalent to above, but opens it with `open` command
fop() {
  local file
  file=$(fzf --query="$1" --select-1 --exit-0)
  [ -n "$file" ] && open "$file"
}

# fd - cd to selected directory
fcd() {
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
fcdf() {
   local file
   local dir
   file=$(fzf +m -q "$1") && dir=$(dirname "$file") && cd "$dir"
}
bindkey -s '^O' '^qfcdf\n'

# fkill - kill process
fkill() {
  ps -ef | sed 1d | fzf -m | awk '{print $2}' | xargs kill -${1:-9}
}

# fbr - checkout git branch
fgb() {
  local branches branch
  branches=$(git branch) &&
  branch=$(echo "$branches" | fzf +s +m) &&
  git checkout $(echo "$branch" | sed "s/.* //")
}
bindkey -s '^G' '^qfgb\n'

# fco - checkout git commit
fgc() {
  local commits commit
  commits=$(git log --pretty=oneline --abbrev-commit --reverse) &&
  commit=$(echo "$commits" | fzf +s +m -e) &&
  git checkout $(echo "$commit" | sed "s/ .*//")
}

# fzgt - checkout git tags
fgt() {
  local tags tag
  tags=$(git tag) &&
  tag=$(echo "$tags" | fzf +s +m) &&
  git checkout tags/$(echo "$tag" | sed "s/.* //")
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

#read man pages with vim
van() {
  vim -c "SuperMan $*"

  if [ "$?" != "0" ]; then
    echo "No manual entry for $*"
  fi
}
