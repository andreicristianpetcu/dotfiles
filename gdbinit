python
import sys 
import os
from os.path import expanduser

home = expanduser("~")
gdbprettyprint = home + '/.libstdc--v3python'
if os.path.isdir(gdbprettyprint):
  sys.path.insert(0, gdbprettyprint)
  from libstdcxx.v6.printers import register_libstdcxx_printers
  print('-->GDB pretty printers registered')

boostprettyprint = home + '/.Boost-Pretty-Printer.git'
if os.path.isdir(boostprettyprint):
  sys.path.insert(0, boostprettyprint)
  import boost.latest
  boost.register_printers()
  print('-->Boost pretty printers registered')

end

set print pretty on
set print object on
set print static-members on
set print vtbl on
set print demangle on
set demangle-style gnu-v3
