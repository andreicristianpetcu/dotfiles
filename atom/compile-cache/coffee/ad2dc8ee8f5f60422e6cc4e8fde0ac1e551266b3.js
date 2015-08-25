(function() {
  var ProjectsListView, git, gitInit, init, notifier;

  git = require('../git');

  ProjectsListView = require('../views/projects-list-view');

  notifier = require('../notifier');

  gitInit = function() {
    var currentFile, promise, _ref;
    currentFile = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0;
    if (!currentFile && atom.project.getPaths().length > 1) {
      return promise = new ProjectsListView().result.then(function(path) {
        return init(path);
      });
    } else {
      return init(atom.project.getPaths()[0]);
    }
  };

  init = function(path) {
    return git.cmd({
      args: ['init'],
      cwd: path,
      stdout: function(data) {
        notifier.addSuccess(data);
        return atom.project.setPaths([path]);
      }
    });
  };

  module.exports = gitInit;

}).call(this);
