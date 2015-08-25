(function() {
  var git, gitStashSave, notifier;

  git = require('../git');

  notifier = require('../notifier');

  gitStashSave = function(repo) {
    var notification;
    notification = notifier.addInfo('Saving...', {
      dismissable: true
    });
    return git.cmd({
      args: ['stash', 'save'],
      cwd: repo.getWorkingDirectory(),
      options: {
        env: process.env.NODE_ENV
      },
      stdout: function(data) {
        notification.dismiss();
        return notifier.addSuccess(data);
      }
    });
  };

  module.exports = gitStashSave;

}).call(this);
