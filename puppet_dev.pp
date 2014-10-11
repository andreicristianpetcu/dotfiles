Package { ensure =>  "installed" }
$my_packages = [ "tmux", "emacs", "vim", "ctags", "ack", "git", "ranger", "nmap", "mc", "zsh", "wget", "curl", "rsync", "htop", "iotop", "lsof", "llvm", "make", "nmon"]
package { $my_packages: }
