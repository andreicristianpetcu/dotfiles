(function() {
  var git, gitStashPop, notifier;

  git = require('../git');

  notifier = require('../notifier');

  gitStashPop = function(repo) {
    return git.cmd({
      args: ['stash', 'pop'],
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
        return notifier.addError(data);
      }
    });
  };

  module.exports = gitStashPop;

}).call(this);
