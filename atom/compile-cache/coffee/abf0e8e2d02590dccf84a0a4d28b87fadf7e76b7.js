(function() {
  var CompositeDisposable, Housekeeping, Mixin, fs, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require("fs-plus");

  path = require("path");

  Mixin = require('mixto');

  module.exports = Housekeeping = (function(_super) {
    __extends(Housekeeping, _super);

    function Housekeeping() {
      return Housekeeping.__super__.constructor.apply(this, arguments);
    }

    Housekeeping.prototype.initializeHousekeeping = function() {
      this.subscriptions = new CompositeDisposable();
      this.subscriptions.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          _this.cancelUpdate();
          _this.destroyDecoration();
          return _this.subscriptions.dispose();
        };
      })(this)));
      if (this.repositoryForPath(this.editor.getPath())) {
        this.subscribeToRepository();
        this.subscriptions.add(this.editor.onDidStopChanging(this.notifyContentsModified));
        this.subscriptions.add(this.editor.onDidChangePath(this.notifyContentsModified));
        this.subscriptions.add(this.editor.onDidChangeCursorPosition((function(_this) {
          return function() {
            return _this.notifyChangeCursorPosition();
          };
        })(this)));
        this.subscriptions.add(atom.project.onDidChangePaths((function(_this) {
          return function() {
            return _this.subscribeToRepository();
          };
        })(this)));
        this.subscriptions.add(atom.commands.add(this.editorView, 'git-diff-details:toggle-git-diff-details', (function(_this) {
          return function() {
            return _this.toggleShowDiffDetails();
          };
        })(this)));
        this.subscriptions.add(atom.commands.add("atom-text-editor", 'git-diff-details:close-git-diff-details', (function(_this) {
          return function(e) {
            if (_this.showDiffDetails) {
              return _this.closeDiffDetails();
            } else {
              return e.abortKeyBinding();
            }
          };
        })(this)));
        this.subscriptions.add(atom.commands.add(this.editorView, 'git-diff-details:undo', (function(_this) {
          return function(e) {
            if (_this.showDiffDetails) {
              return _this.undo();
            } else {
              return e.abortKeyBinding();
            }
          };
        })(this)));
        this.subscriptions.add(atom.commands.add(this.editorView, 'git-diff-details:copy', (function(_this) {
          return function(e) {
            if (_this.showDiffDetails) {
              return _this.copy();
            } else {
              return e.abortKeyBinding();
            }
          };
        })(this)));
        return this.scheduleUpdate();
      } else {
        this.subscriptions.add(atom.commands.add(this.editorView, 'git-diff-details:toggle-git-diff-details', function(e) {
          return e.abortKeyBinding();
        }));
        this.subscriptions.add(atom.commands.add("atom-text-editor", 'git-diff-details:close-git-diff-details', function(e) {
          return e.abortKeyBinding();
        }));
        this.subscriptions.add(atom.commands.add(this.editorView, 'git-diff-details:undo', function(e) {
          return e.abortKeyBinding();
        }));
        return this.subscriptions.add(atom.commands.add(this.editorView, 'git-diff-details:copy', function(e) {
          return e.abortKeyBinding();
        }));
      }
    };

    Housekeeping.prototype.repositoryForPath = function(goalPath) {
      var directory, i, _i, _len, _ref;
      _ref = atom.project.getDirectories();
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        directory = _ref[i];
        if (goalPath === directory.getPath() || directory.contains(goalPath)) {
          return atom.project.getRepositories()[i];
        }
      }
      return null;
    };

    Housekeeping.prototype.subscribeToRepository = function() {
      var repository;
      if (repository = this.repositoryForPath(this.editor.getPath())) {
        this.subscriptions.add(repository.onDidChangeStatuses((function(_this) {
          return function() {
            return _this.scheduleUpdate();
          };
        })(this)));
        return this.subscriptions.add(repository.onDidChangeStatus((function(_this) {
          return function(changedPath) {
            if (changedPath === _this.editor.getPath()) {
              return _this.scheduleUpdate();
            }
          };
        })(this)));
      }
    };

    Housekeeping.prototype.unsubscribeFromCursor = function() {
      var _ref;
      if ((_ref = this.cursorSubscription) != null) {
        _ref.dispose();
      }
      return this.cursorSubscription = null;
    };

    Housekeeping.prototype.cancelUpdate = function() {
      return clearImmediate(this.immediateId);
    };

    Housekeeping.prototype.scheduleUpdate = function() {
      this.cancelUpdate();
      return this.immediateId = setImmediate(this.notifyContentsModified);
    };

    return Housekeeping;

  })(Mixin);

}).call(this);
