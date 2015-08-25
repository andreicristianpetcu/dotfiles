(function() {
  var MergeListView, git;

  git = require('../git');

  MergeListView = require('../views/merge-list-view');

  module.exports = function(repo) {
    return git.cmd({
      args: ['branch'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return new MergeListView(repo, data);
      }
    });
  };

}).call(this);
