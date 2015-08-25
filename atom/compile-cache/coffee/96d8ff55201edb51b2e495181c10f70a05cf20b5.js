(function() {
  var GitCommit, git, gitAddAndCommit;

  git = require('../git');

  GitCommit = require('./git-commit');

  gitAddAndCommit = function(repo) {
    var _ref;
    return git.add(repo, {
      file: repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0),
      exit: function() {
        return new GitCommit(repo);
      }
    });
  };

  module.exports = gitAddAndCommit;

}).call(this);
