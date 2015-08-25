(function() {
  var fs, path;

  fs = require("fs-plus");

  path = require("path");

  module.exports = {
    repositoryForPath: function(goalPath) {
      var directory, i, _i, _len, _ref;
      _ref = atom.project.getDirectories();
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        directory = _ref[i];
        if (goalPath === directory.getPath() || directory.contains(goalPath)) {
          return atom.project.getRepositories()[i];
        }
      }
      return null;
    }
  };

}).call(this);
