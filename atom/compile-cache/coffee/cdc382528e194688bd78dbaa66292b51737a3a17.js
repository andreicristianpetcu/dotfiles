(function() {
  var git, gitCheckoutCurrentFile, notifier;

  git = require('../git');

  notifier = require('../notifier');

  gitCheckoutCurrentFile = function(repo) {
    var currentFile, _ref;
    currentFile = repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    return git.cmd({
      args: ['checkout', '--', currentFile],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        notifier.addSuccess('File changes checked out successfully');
        return git.refresh();
      }
    });
  };

  module.exports = gitCheckoutCurrentFile;

}).call(this);
