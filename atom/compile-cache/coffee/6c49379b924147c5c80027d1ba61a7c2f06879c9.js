(function() {
  var $, BranchListView, CompositeDisposable, InputView, RemoteBranchListView, TextEditorView, View, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('atom-space-pen-views'), $ = _ref.$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  git = require('../git');

  notifier = require('../notifier');

  BranchListView = require('../views/branch-list-view');

  RemoteBranchListView = require('../views/remote-branch-list-view');

  InputView = (function(_super) {
    __extends(InputView, _super);

    function InputView() {
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function() {
      return this.div((function(_this) {
        return function() {
          return _this.subview('branchEditor', new TextEditorView({
            mini: true,
            placeholderText: 'New branch name'
          }));
        };
      })(this));
    };

    InputView.prototype.initialize = function(repo) {
      var destroy, panel;
      this.repo = repo;
      this.disposables = new CompositeDisposable;
      this.currentPane = atom.workspace.getActivePane();
      panel = atom.workspace.addModalPanel({
        item: this
      });
      panel.show();
      destroy = (function(_this) {
        return function() {
          panel.destroy();
          _this.disposables.dispose();
          return _this.currentPane.activate();
        };
      })(this);
      this.branchEditor.focus();
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:cancel': function(event) {
          return destroy();
        }
      }));
      return this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:confirm': (function(_this) {
          return function(event) {
            var editor, name;
            editor = _this.branchEditor.getModel();
            name = editor.getText();
            if (name.length > 0) {
              _this.createBranch(name);
              return destroy();
            }
          };
        })(this)
      }));
    };

    InputView.prototype.createBranch = function(name) {
      return git.cmd({
        args: ['checkout', '-b', name],
        cwd: this.repo.getWorkingDirectory(),
        stderr: (function(_this) {
          return function(data) {
            notifier.addSuccess(data.toString());
            git.refresh();
            return _this.currentPane.activate();
          };
        })(this)
      });
    };

    return InputView;

  })(View);

  module.exports.newBranch = function(repo) {
    return new InputView(repo);
  };

  module.exports.gitBranches = function(repo) {
    return git.cmd({
      args: ['branch'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return new BranchListView(repo, data);
      }
    });
  };

  module.exports.gitRemoteBranches = function(repo) {
    return git.cmd({
      args: ['branch', '-r'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return new RemoteBranchListView(repo, data);
      }
    });
  };

}).call(this);
