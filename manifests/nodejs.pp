include nodejs

package { 'jsctags':
  ensure   => present,
  provider =>  'npm',
}
