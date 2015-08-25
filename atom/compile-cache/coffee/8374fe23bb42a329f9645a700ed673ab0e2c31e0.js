(function() {
  var git, gitAdd;

  git = require('../git');

  gitAdd = function(repo, _arg) {
    var addAll, file, _ref;
    addAll = (_arg != null ? _arg : {}).addAll;
    if (!addAll) {
      file = repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    } else {
      file = null;
    }
    return git.add(repo, {
      file: file
    });
  };

  module.exports = gitAdd;

}).call(this);
