(function() {
  var GitCommit, git, gitCommitAmend;

  git = require('../git');

  GitCommit = require('./git-commit');

  gitCommitAmend = function(repo) {
    return git.cmd({
      args: ['log', '-1', '--format=%B'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(amend) {
        return git.cmd({
          args: ['reset', '--soft', 'HEAD^'],
          cwd: repo.getWorkingDirectory(),
          exit: function() {
            return new GitCommit(repo, {
              amend: "" + (amend != null ? amend.trim() : void 0) + "\n"
            });
          }
        });
      }
    });
  };

  module.exports = gitCommitAmend;

}).call(this);
