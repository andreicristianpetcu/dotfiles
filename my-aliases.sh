# ssh
alias sshalaveteli="ssh alaveteli"

# pacman
alias pacmansyu='sudo pacman -Syu'        # Synchronize with repositories and then upgrade packages that are out of date on the local system.
alias pacmans='sudo pacman S'           # Install specific package(s) from the repositories
alias pacmanu='sudo pacman U'          # Install specific package not from the repositories but from a file 
alias pacmanr='sudo pacman -R'           # Remove the specified package(s), retaining its configuration(s) and required dependencies
alias pacmanrns='sudo pacman -Rns'        # Remove the specified package(s), its configuration(s) and unneeded dependencies
alias pacmansi='pacman -Si'              # Display information about a given package in the repositories
alias pacmanss='pacman -Ss'             # Search for package(s) in the repositories
alias pacmanqi='pacman -Qi'              # Display information about a given package in the local database
alias pacmanqs='pacman -Qs'             # Search for package(s) in the local database
alias pacmansyy='sudo pacman -Syy'                # Force refresh of all package lists after updating /etc/pacman.d/mirrorlist

# git
alias gitadd='git add . --all'
alias gitaddallgitcommit='git add . --all && git commit'
alias gitpushoriginmaster='git push origin master'

# vagrant
alias vagrantboxlist='vagrant box list'
alias vagrantsuspend='vagrant suspend'
alias vagrantresume='vagrant resume'
alias vagrantup='vagrant up'
alias vagrantssh='vagrant ssh'
alias vagrantreloadprovision='vagrant reload --provision'
