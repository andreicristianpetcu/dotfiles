cd /mnt/rsync_clone
mount -t proc proc proc/
mount -t sysfs sys sys/
mount -o bind /dev dev/
mount -t devpts pts dev/pts/
cp -L /etc/resolv.conf etc/resolv.conf
chroot /mnt/rsync_clone /usr/bin/bash
export PS1="(chroot) $PS1"
