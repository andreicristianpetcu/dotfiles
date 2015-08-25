(function() {
  var ListView, git, gitDeleteLocalBranch;

  git = require('../git');

  ListView = require('../views/delete-branch-view');

  gitDeleteLocalBranch = function(repo) {
    return git.cmd({
      args: ['branch'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return new ListView(repo, data.toString());
      }
    });
  };

  module.exports = gitDeleteLocalBranch;

}).call(this);
