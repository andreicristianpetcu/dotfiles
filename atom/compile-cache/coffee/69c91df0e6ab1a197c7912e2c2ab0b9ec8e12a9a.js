(function() {
  var Ripper, packageManager,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Ripper = require('./ripper');

  packageManager = atom.packages;

  module.exports = {
    activate: function() {
      if (__indexOf.call(packageManager.getAvailablePackageNames(), 'refactor') >= 0 && !packageManager.isPackageDisabled('refactor')) {

      }
    },
    deactivate: function() {},
    serialize: function() {},
    Ripper: Ripper
  };

}).call(this);
