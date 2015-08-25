(function() {
  var StatusListView, git, gitStatus;

  git = require('../git');

  StatusListView = require('../views/status-list-view');

  gitStatus = function(repo) {
    return git.status(repo, function(data) {
      return new StatusListView(repo, data);
    });
  };

  module.exports = gitStatus;

}).call(this);
