(function() {
  var ListView, git, gitFetch;

  git = require('../git');

  ListView = require('../views/remote-list-view');

  gitFetch = function(repo) {
    return git.cmd({
      args: ['remote'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return new ListView(repo, data.toString(), {
          mode: 'fetch'
        });
      }
    });
  };

  module.exports = gitFetch;

}).call(this);
