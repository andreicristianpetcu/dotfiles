(function() {
  var git, gitStashDrop, notifier;

  git = require('../git');

  notifier = require('../notifier');

  gitStashDrop = function(repo) {
    return git.cmd({
      args: ['stash', 'drop'],
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

  module.exports = gitStashDrop;

}).call(this);
