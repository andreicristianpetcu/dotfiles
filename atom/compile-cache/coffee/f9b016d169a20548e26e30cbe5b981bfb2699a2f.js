(function() {
  var git, gitCheckoutAllFiles, notifier;

  git = require('../git');

  notifier = require('../notifier');

  gitCheckoutAllFiles = function(repo) {
    return git.cmd({
      args: ['checkout', '-f'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        notifier.addSuccess("File changes checked out successfully!");
        return git.refresh();
      }
    });
  };

  module.exports = gitCheckoutAllFiles;

}).call(this);
