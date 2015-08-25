(function() {
  var ListView, git, gitDeleteRemoteBranch;

  git = require('../git');

  ListView = require('../views/delete-branch-view');

  gitDeleteRemoteBranch = function(repo) {
    return git.cmd({
      args: ['branch', '-r'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return new ListView(repo, data.toString(), {
          isRemote: true
        });
      }
    });
  };

  module.exports = gitDeleteRemoteBranch;

}).call(this);
