(function() {
  var $$, FileView, SymbolsView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $$ = require('atom-space-pen-views').$$;

  SymbolsView = require('./symbols-view');

  module.exports = FileView = (function(_super) {
    __extends(FileView, _super);

    function FileView() {
      return FileView.__super__.constructor.apply(this, arguments);
    }

    FileView.prototype.initialize = function() {
      FileView.__super__.initialize.apply(this, arguments);
      return this.editorsSubscription = atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var disposable;
          disposable = editor.onDidSave(function() {
            var f;
            f = editor.getPath();
            if (!atom.project.contains(f)) {
              return;
            }
            return _this.ctagsCache.generateTags(f, true);
          });
          return editor.onDidDestroy(function() {
            return disposable.dispose();
          });
        };
      })(this));
    };

    FileView.prototype.destroy = function() {
      this.editorsSubscription.dispose();
      return FileView.__super__.destroy.apply(this, arguments);
    };

    FileView.prototype.viewForItem = function(_arg) {
      var file, lineNumber, name, pattern;
      lineNumber = _arg.lineNumber, name = _arg.name, file = _arg.file, pattern = _arg.pattern;
      return $$(function() {
        return this.li({
          "class": 'two-lines'
        }, (function(_this) {
          return function() {
            _this.div({
              "class": 'primary-line'
            }, function() {
              _this.span(name, {
                "class": 'pull-left'
              });
              return _this.span(pattern, {
                "class": 'pull-right'
              });
            });
            return _this.div({
              "class": 'secondary-line'
            }, function() {
              _this.span("Line: " + lineNumber, {
                "class": 'pull-left'
              });
              return _this.span(file, {
                "class": 'pull-right'
              });
            });
          };
        })(this));
      });
    };

    FileView.prototype.toggle = function() {
      var editor, filePath;
      if (this.panel.isVisible()) {
        return this.cancel();
      } else {
        editor = atom.workspace.getActiveTextEditor();
        if (!editor) {
          return;
        }
        filePath = editor.getPath();
        if (!filePath) {
          return;
        }
        this.cancelPosition = editor.getCursorBufferPosition();
        this.populate(filePath);
        return this.attach();
      }
    };

    FileView.prototype.cancel = function() {
      FileView.__super__.cancel.apply(this, arguments);
      if (this.cancelPosition) {
        this.scrollToPosition(this.cancelPosition, false);
      }
      return this.cancelPosition = null;
    };

    FileView.prototype.toggleAll = function() {
      var key, tags, val, _ref;
      if (this.panel.isVisible()) {
        return this.cancel();
      } else {
        this.list.empty();
        this.maxItems = 10;
        tags = [];
        _ref = this.ctagsCache.cachedTags;
        for (key in _ref) {
          val = _ref[key];
          tags.push.apply(tags, val);
        }
        this.setItems(tags);
        return this.attach();
      }
    };

    FileView.prototype.getCurSymbol = function() {
      var cursor, editor, range;
      editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        console.error("[atom-ctags:getCurSymbol] failed getActiveTextEditor ");
        return;
      }
      cursor = editor.getLastCursor();
      if (cursor.getScopeDescriptor().getScopesArray().indexOf('source.ruby') !== -1) {
        range = cursor.getCurrentWordBufferRange({
          wordRegex: /[\w!?]*/g
        });
      } else {
        range = cursor.getCurrentWordBufferRange();
      }
      return editor.getTextInRange(range);
    };

    FileView.prototype.rebuild = function() {
      var projectPath, projectPaths, _i, _len, _results;
      projectPaths = atom.project.getPaths();
      if (projectPaths.length < 1) {
        console.error("[atom-ctags:rebuild] cancel rebuild, invalid projectPath: " + projectPath);
        return;
      }
      this.ctagsCache.cachedTags = {};
      _results = [];
      for (_i = 0, _len = projectPaths.length; _i < _len; _i++) {
        projectPath = projectPaths[_i];
        _results.push(this.ctagsCache.generateTags(projectPath));
      }
      return _results;
    };

    FileView.prototype.goto = function() {
      var symbol, tags;
      symbol = this.getCurSymbol();
      if (!symbol) {
        console.error("[atom-ctags:goto] failed getCurSymbol");
        return;
      }
      tags = this.ctagsCache.findTags(symbol);
      if (tags.length === 1) {
        return this.openTag(tags[0]);
      } else {
        this.setItems(tags);
        return this.attach();
      }
    };

    FileView.prototype.populate = function(filePath) {
      this.list.empty();
      this.setLoading('Generating symbols\u2026');
      return this.ctagsCache.getOrCreateTags(filePath, (function(_this) {
        return function(tags) {
          _this.maxItem = Infinity;
          return _this.setItems(tags);
        };
      })(this));
    };

    FileView.prototype.scrollToItemView = function(view) {
      var tag;
      FileView.__super__.scrollToItemView.apply(this, arguments);
      if (!this.cancelPosition) {
        return;
      }
      tag = this.getSelectedItem();
      return this.scrollToPosition(this.getTagPosition(tag));
    };

    FileView.prototype.scrollToPosition = function(position, select) {
      var editor;
      if (select == null) {
        select = true;
      }
      if (editor = atom.workspace.getActiveTextEditor()) {
        editor.scrollToBufferPosition(position, {
          center: true
        });
        editor.setCursorBufferPosition(position);
        if (select) {
          return editor.selectWordsContainingCursors();
        }
      }
    };

    return FileView;

  })(SymbolsView);

}).call(this);
