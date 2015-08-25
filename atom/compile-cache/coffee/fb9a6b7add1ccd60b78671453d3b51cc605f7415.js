(function() {
  var $, BufferedProcess, CompositeDisposable, Os, Path, TagCreateView, TextEditorView, View, fs, git, notifier, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Os = require('os');

  Path = require('path');

  fs = require('fs-plus');

  _ref = require('atom'), BufferedProcess = _ref.BufferedProcess, CompositeDisposable = _ref.CompositeDisposable;

  _ref1 = require('atom-space-pen-views'), $ = _ref1.$, TextEditorView = _ref1.TextEditorView, View = _ref1.View;

  notifier = require('../notifier');

  git = require('../git');

  module.exports = TagCreateView = (function(_super) {
    __extends(TagCreateView, _super);

    function TagCreateView() {
      return TagCreateView.__super__.constructor.apply(this, arguments);
    }

    TagCreateView.content = function() {
      return this.div((function(_this) {
        return function() {
          _this.div({
            "class": 'block'
          }, function() {
            return _this.subview('tagName', new TextEditorView({
              mini: true,
              placeholderText: 'Tag'
            }));
          });
          _this.div({
            "class": 'block'
          }, function() {
            return _this.subview('tagMessage', new TextEditorView({
              mini: true,
              placeholderText: 'Annotation message'
            }));
          });
          return _this.div({
            "class": 'block'
          }, function() {
            _this.span({
              "class": 'pull-left'
            }, function() {
              return _this.button({
                "class": 'btn btn-success inline-block-tight gp-confirm-button',
                click: 'createTag'
              }, 'Create Tag');
            });
            return _this.span({
              "class": 'pull-right'
            }, function() {
              return _this.button({
                "class": 'btn btn-error inline-block-tight gp-cancel-button',
                click: 'destroy'
              }, 'Cancel');
            });
          });
        };
      })(this));
    };

    TagCreateView.prototype.initialize = function(repo) {
      this.repo = repo;
      this.disposables = new CompositeDisposable;
      this.currentPane = atom.workspace.getActivePane();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.tagName.focus();
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
            return _this.createTag();
          };
        })(this)
      }));
    };

    TagCreateView.prototype.createTag = function() {
      var tag;
      tag = {
        name: this.tagName.getModel().getText(),
        message: this.tagMessage.getModel().getText()
      };
      git.cmd({
        args: ['tag', '-a', tag.name, '-m', tag.message],
        cwd: this.repo.getWorkingDirectory(),
        stderr: function(data) {
          return notifier.addError(data.toString());
        },
        exit: function(code) {
          if (code === 0) {
            return notifier.addSuccess("Tag '" + tag.name + "' has been created successfully!");
          }
        }
      });
      return this.destroy();
    };

    TagCreateView.prototype.destroy = function() {
      var _ref2;
      if ((_ref2 = this.panel) != null) {
        _ref2.destroy();
      }
      this.disposables.dispose();
      return this.currentPane.activate();
    };

    return TagCreateView;

  })(View);

}).call(this);
