(function() {
  var git, gitStashApply, notifier;

  git = require('../git');

  notifier = require('../notifier');

  gitStashApply = function(repo) {
    return git.cmd({
      args: ['stash', 'apply'],
      cwd: repo.getWorkingDirectory(),
      options: {
        env: process.env.NODE_ENV
      },
      stdout: function(data) {
        if (data.toString().length > 0) {
          return notifier.addSuccess(data);
        }
      },
      stderr: function(data) {
        return notifier.addError(data.toString());
      }
    });
  };

  module.exports = gitStashApply;

}).call(this);
