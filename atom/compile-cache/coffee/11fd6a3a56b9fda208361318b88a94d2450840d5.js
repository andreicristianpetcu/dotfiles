(function() {
  var $, CompositeDisposable, InputView, Os, Path, TextEditorView, View, fs, git, prepFile, showCommitFilePath, showFile, showObject, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Os = require('os');

  Path = require('path');

  fs = require('fs-plus');

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('atom-space-pen-views'), $ = _ref.$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  git = require('../git');

  showCommitFilePath = function(objectHash) {
    return Path.join(Os.tmpDir(), "" + objectHash + ".diff");
  };

  showObject = function(repo, objectHash, file) {
    var args;
    args = ['show'];
    args.push('--format=full');
    if (atom.config.get('git-plus.wordDiff')) {
      args.push('--word-diff');
    }
    args.push(objectHash);
    if (file != null) {
      args.push('--');
      args.push(file);
    }
    return git.cmd({
      args: args,
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        if (data.length > 0) {
          return prepFile(data, objectHash);
        }
      }
    });
  };

  prepFile = function(text, objectHash) {
    fs.writeFileSync(showCommitFilePath(objectHash), text, {
      flag: 'w+'
    });
    return showFile(objectHash);
  };

  showFile = function(objectHash) {
    var disposables, split;
    disposables = new CompositeDisposable;
    split = atom.config.get('git-plus.openInPane') ? atom.config.get('git-plus.splitPane') : void 0;
    return atom.workspace.open(showCommitFilePath(objectHash), {
      split: split,
      activatePane: true
    }).done((function(_this) {
      return function(textBuffer) {
        if (textBuffer != null) {
          return disposables.add(textBuffer.onDidDestroy(function() {
            disposables.dispose();
            try {
              return fs.unlinkSync(showCommitFilePath(objectHash));
            } catch (_error) {}
          }));
        }
      };
    })(this));
  };

  InputView = (function(_super) {
    __extends(InputView, _super);

    function InputView() {
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function() {
      return this.div((function(_this) {
        return function() {
          return _this.subview('objectHash', new TextEditorView({
            mini: true,
            placeholderText: 'Commit hash to show'
          }));
        };
      })(this));
    };

    InputView.prototype.initialize = function(repo) {
      this.repo = repo;
      this.disposables = new CompositeDisposable;
      this.currentPane = atom.workspace.getActivePane();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.objectHash.focus();
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.destroy();
          };
        })(this)
      }));
      return this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:confirm': (function(_this) {
          return function() {
            var name, text;
            text = _this.objectHash.getModel().getText().split(' ');
            name = text.length === 2 ? text[1] : text[0];
            showObject(_this.repo, text);
            return _this.destroy();
          };
        })(this)
      }));
    };

    InputView.prototype.destroy = function() {
      var _ref1, _ref2;
      if ((_ref1 = this.disposables) != null) {
        _ref1.dispose();
      }
      return (_ref2 = this.panel) != null ? _ref2.destroy() : void 0;
    };

    return InputView;

  })(View);

  module.exports = function(repo, objectHash, file) {
    if (objectHash == null) {
      return new InputView(repo);
    } else {
      return showObject(repo, objectHash, file);
    }
  };

}).call(this);
