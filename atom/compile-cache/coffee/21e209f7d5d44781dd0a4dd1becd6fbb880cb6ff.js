(function() {
  var SelectStageHunkFile, git, gitStageHunk;

  git = require('../git');

  SelectStageHunkFile = require('../views/select-stage-hunk-file-view');

  gitStageHunk = function(repo) {
    return git.unstagedFiles(repo, null, function(data) {
      return new SelectStageHunkFile(repo, data);
    });
  };

  module.exports = gitStageHunk;

}).call(this);
