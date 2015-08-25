(function() {
  var SelectStageFiles, git, gitStageFiles;

  git = require('../git');

  SelectStageFiles = require('../views/select-stage-files-view');

  gitStageFiles = function(repo) {
    return git.unstagedFiles(repo, {
      showUntracked: true
    }, function(data) {
      return new SelectStageFiles(repo, data);
    });
  };

  module.exports = gitStageFiles;

}).call(this);
