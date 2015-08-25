(function() {
  var RemoveListView, git, gitRemove, notifier, prettify;

  git = require('../git');

  notifier = require('../notifier');

  RemoveListView = require('../views/remove-list-view');

  gitRemove = function(repo, _arg) {
    var currentFile, showSelector, _ref;
    showSelector = (_arg != null ? _arg : {}).showSelector;
    currentFile = repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    if ((currentFile != null) && !showSelector) {
      if (window.confirm('Are you sure?')) {
        atom.workspace.getActivePaneItem().destroy();
        return git.cmd({
          args: ['rm', '-f', '--ignore-unmatch', currentFile],
          cwd: repo.getWorkingDirectory(),
          stdout: function(data) {
            return notifier.addSuccess("Removed " + (prettify(data)));
          }
        });
      }
    } else {
      return git.cmd({
        args: ['rm', '-r', '-n', '--ignore-unmatch', '-f', '*'],
        cwd: repo.getWorkingDirectory(),
        stdout: function(data) {
          return new RemoveListView(repo, prettify(data));
        }
      });
    }
  };

  prettify = function(data) {
    var file, i, _i, _len, _results;
    data = data.match(/rm ('.*')/g);
    if (data) {
      _results = [];
      for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
        file = data[i];
        _results.push(data[i] = file.match(/rm '(.*)'/)[1]);
      }
      return _results;
    } else {
      return data;
    }
  };

  module.exports = gitRemove;

}).call(this);
