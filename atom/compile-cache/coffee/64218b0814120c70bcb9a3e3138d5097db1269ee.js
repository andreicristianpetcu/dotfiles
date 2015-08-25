(function() {
  var GitDiff, git, gitStat;

  git = require('../git');

  GitDiff = require('./git-diff');

  gitStat = function(repo) {
    var args;
    args = ['diff', '--stat'];
    if (atom.config.get('git-plus.includeStagedDiff')) {
      args.push('HEAD');
    }
    return git.cmd({
      args: args,
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return GitDiff(repo, {
          diffStat: data,
          file: '.'
        });
      }
    });
  };

  module.exports = gitStat;

}).call(this);
