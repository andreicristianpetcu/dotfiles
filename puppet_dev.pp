Package { ensure =>  "installed" }
$common_packages = [ "tmux", "emacs", "ctags", "git", "ranger", "nmap", "mc", "zsh", "wget", "curl",
    "rsync", "htop", "iotop", "lsof", "llvm", "make", "nmon", "autojump", "elinks", "telnet"]

$debian_packages = ["vim", "ack-grep", "silversearcher-ag"]
$ubuntu_packages = ["vim", "ack-grep", "silversearcher-ag"]
$archgnulinux_packages = ["gvim", "ack", "silver-searcher-git"]

case $operatingsystem {
  # centos: { $os_specific_packages = "httpd" }
  # Note that these matches are case-insensitive.
  # redhat: { $os_specific_packages = "httpd" }
  debian: { $os_specific_packages = $debian_packages }
  ubuntu: { $os_specific_packages = $ubuntu_packages }
  Archlinux: { $os_specific_packages = $archgnulinux_packages }
  default: { fail("Unrecognized operating system $operatingsystem") }
}

package { $common_packages: }
package { $os_specific_packages: }
