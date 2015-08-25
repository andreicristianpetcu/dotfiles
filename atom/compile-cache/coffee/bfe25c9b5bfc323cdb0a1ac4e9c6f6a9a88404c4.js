(function() {
  var TagListView, git, gitTags;

  git = require('../git');

  TagListView = require('../views/tag-list-view');

  gitTags = function(repo) {
    this.TagListView = null;
    return git.cmd({
      args: ['tag', '-ln'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return this.TagListView = new TagListView(repo, data);
      },
      exit: function() {
        if (this.TagListView == null) {
          return new TagListView(repo);
        }
      }
    });
  };

  module.exports = gitTags;

}).call(this);
