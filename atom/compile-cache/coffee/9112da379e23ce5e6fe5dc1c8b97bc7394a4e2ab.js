(function() {
  var $, CompositeDisposable, InputView, TextEditorView, View, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('atom-space-pen-views'), $ = _ref.$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  git = require('../git');

  notifier = require('../notifier');

  InputView = (function(_super) {
    __extends(InputView, _super);

    function InputView() {
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function() {
      return this.div((function(_this) {
        return function() {
          return _this.subview('commandEditor', new TextEditorView({
            mini: true,
            placeHolderText: 'Git command and arguments'
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
      this.commandEditor.focus();
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:cancel': (function(_this) {
          return function(e) {
            var _ref1;
            if ((_ref1 = _this.panel) != null) {
              _ref1.destroy();
            }
            _this.currentPane.activate();
            return _this.disposables.dispose();
          };
        })(this)
      }));
      return this.disposables.add(atom.commands.add('atom-text-editor', 'core:confirm', (function(_this) {
        return function(e) {
          var args, _ref1;
          _this.disposables.dispose();
          if ((_ref1 = _this.panel) != null) {
            _ref1.destroy();
          }
          args = _this.commandEditor.getText().split(' ');
          if (args[0] === 1) {
            args.shift();
          }
          return git.cmd({
            args: args,
            cwd: _this.repo.getWorkingDirectory(),
            stdout: function(data) {
              if (data.toString().length > 0) {
                notifier.addSuccess(data.toString());
              }
              git.refresh();
              return _this.currentPane.activate();
            }
          });
        };
      })(this)));
    };

    return InputView;

  })(View);

  module.exports = function(repo) {
    return new InputView(repo);
  };

}).call(this);
