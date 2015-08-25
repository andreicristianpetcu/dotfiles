(function() {
  var SelectUnstageFiles, git, gitUnstageFiles;

  git = require('../git');

  SelectUnstageFiles = require('../views/select-unstage-files-view');

  gitUnstageFiles = function(repo) {
    return git.stagedFiles(repo, function(data) {
      return new SelectUnstageFiles(repo, data);
    });
  };

  module.exports = gitUnstageFiles;

}).call(this);
