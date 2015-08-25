(function() {
  var CompositeDisposable, Os, Path, diffFilePath, disposables, fs, git, gitDiff, notifier, prepFile, showFile, splitPane;

  CompositeDisposable = require('atom').CompositeDisposable;

  Os = require('os');

  Path = require('path');

  fs = require('fs-plus');

  git = require('../git');

  notifier = require('../notifier');

  disposables = new CompositeDisposable;

  diffFilePath = null;

  gitDiff = function(repo, _arg) {
    var args, diffStat, file, _ref, _ref1;
    _ref = _arg != null ? _arg : {}, diffStat = _ref.diffStat, file = _ref.file;
    diffFilePath = Path.join(repo.getPath(), "atom_git_plus.diff");
    if (file == null) {
      file = repo.relativize((_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0);
    }
    if (!file) {
      return notifier.addError("No open file. Select 'Diff All'.");
    }
    if (diffStat == null) {
      diffStat = '';
    }
    args = ['diff', '--color=never'];
    if (atom.config.get('git-plus.includeStagedDiff')) {
      args.push('HEAD');
    }
    if (atom.config.get('git-plus.wordDiff')) {
      args.push('--word-diff');
    }
    if (diffStat === '') {
      args.push(file);
    }
    return git.cmd({
      args: args,
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return diffStat += data;
      },
      exit: function(code) {
        if (code === 0) {
          return prepFile(diffStat);
        }
      }
    });
  };

  prepFile = function(text) {
    if ((text != null ? text.length : void 0) > 0) {
      fs.writeFileSync(diffFilePath, text, {
        flag: 'w+'
      });
      return showFile();
    } else {
      return notifier.addInfo('Nothing to show.');
    }
  };

  showFile = function() {
    return atom.workspace.open(diffFilePath, {
      searchAllPanes: true
    }).done(function(textEditor) {
      if (atom.config.get('git-plus.openInPane')) {
        return splitPane(atom.config.get('git-plus.splitPane'), textEditor);
      } else {
        return disposables.add(textEditor.onDidDestroy((function(_this) {
          return function() {
            return fs.unlink(diffFilePath);
          };
        })(this)));
      }
    });
  };

  splitPane = function(splitDir, oldEditor) {
    var directions, hookEvents, options, pane;
    pane = atom.workspace.paneForURI(diffFilePath);
    options = {
      copyActiveItem: true
    };
    hookEvents = function(textEditor) {
      oldEditor.destroy();
      return disposables.add(textEditor.onDidDestroy((function(_this) {
        return function() {
          return fs.unlink(diffFilePath);
        };
      })(this)));
    };
    directions = {
      left: (function(_this) {
        return function() {
          pane = pane.splitLeft(options);
          return hookEvents(pane.getActiveEditor());
        };
      })(this),
      right: (function(_this) {
        return function() {
          pane = pane.splitRight(options);
          return hookEvents(pane.getActiveEditor());
        };
      })(this),
      up: (function(_this) {
        return function() {
          pane = pane.splitUp(options);
          return hookEvents(pane.getActiveEditor());
        };
      })(this),
      down: (function(_this) {
        return function() {
          pane = pane.splitDown(options);
          return hookEvents(pane.getActiveEditor());
        };
      })(this)
    };
    directions[splitDir]();
    return oldEditor.destroy();
  };

  module.exports = gitDiff;

}).call(this);
