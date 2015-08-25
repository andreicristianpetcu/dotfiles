(function() {
  var RemoteListView, git, gitPush;

  git = require('../git');

  RemoteListView = require('../views/remote-list-view');

  gitPush = function(repo) {
    return git.cmd({
      args: ['remote'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return new RemoteListView(repo, data, {
          mode: 'push'
        });
      }
    });
  };

  module.exports = gitPush;

}).call(this);
