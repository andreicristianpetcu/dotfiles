(function() {
  var GitCommit, git, gitAddAllCommitAndPush;

  git = require('../git');

  GitCommit = require('./git-commit');

  gitAddAllCommitAndPush = function(repo) {
    return git.add(repo, {
      file: null,
      exit: function() {
        return new GitCommit(repo, {
          andPush: true
        });
      }
    });
  };

  module.exports = gitAddAllCommitAndPush;

}).call(this);
