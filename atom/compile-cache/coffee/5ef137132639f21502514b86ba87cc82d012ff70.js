(function() {
  var CompositeDisposable, path;

  CompositeDisposable = require('atom').CompositeDisposable;

  path = require('path');

  module.exports = {
    subscriptions: null,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'open-git-modified-files:open': (function(_this) {
          return function() {
            return _this.open();
          };
        })(this)
      }));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    open: function() {
      var filePath, repo, repos, _i, _len, _results;
      repos = atom.project.getRepositories();
      if (repos != null) {
        _results = [];
        for (_i = 0, _len = repos.length; _i < _len; _i++) {
          repo = repos[_i];
          if (repo == null) {
            break;
          }
          _results.push((function() {
            var _results1;
            _results1 = [];
            for (filePath in repo.statuses) {
              if (repo.isPathModified(filePath) || repo.isPathNew(filePath)) {
                _results1.push(atom.workspace.open(path.join(repo.repo.workingDirectory, filePath)));
              } else {
                _results1.push(void 0);
              }
            }
            return _results1;
          })());
        }
        return _results;
      } else {
        return atom.beep();
      }
    }
  };

}).call(this);
