(function() {
  var GitCommit, git, gitAddAllAndCommit;

  git = require('../git');

  GitCommit = require('./git-commit');

  gitAddAllAndCommit = function(repo) {
    return git.add(repo, {
      exit: function() {
        return new GitCommit(repo);
      }
    });
  };

  module.exports = gitAddAllAndCommit;

}).call(this);
