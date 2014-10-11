Package { ensure =>  "installed" }
$my_packages = [ "tmux", "emacs", "vim", "ctags", "git", "ranger", "nmap", "mc", "zsh", "wget", "curl", "rsync", "htop", "iotop", "lsof", "llvm", "make", "nmon"]
package { $my_packages: }

case $operatingsystem {
  # centos: { $os_specific_packages = "httpd" }
  # Note that these matches are case-insensitive.
  # redhat: { $os_specific_packages = "httpd" }
  debian: { $os_specific_packages = "ack-grep" }
  ubuntu: { $os_specific_packages = "ack-grep" }
  default: { fail("Unrecognized operating system " + $operatingsystem) }
}
package { $os_specific_packages: }
