(function() {
  var $$, Point, SelectListView, SymbolsView, fs, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  Point = require('atom').Point;

  fs = null;

  module.exports = SymbolsView = (function(_super) {
    __extends(SymbolsView, _super);

    function SymbolsView() {
      return SymbolsView.__super__.constructor.apply(this, arguments);
    }

    SymbolsView.activate = function() {
      return new SymbolsView;
    };

    SymbolsView.prototype.initialize = function(stack) {
      this.stack = stack;
      SymbolsView.__super__.initialize.apply(this, arguments);
      this.panel = atom.workspace.addModalPanel({
        item: this,
        visible: false
      });
      return this.addClass('atom-ctags');
    };

    SymbolsView.prototype.destroy = function() {
      this.cancel();
      return this.panel.destroy();
    };

    SymbolsView.prototype.getFilterKey = function() {
      return 'name';
    };

    SymbolsView.prototype.viewForItem = function(_arg) {
      var directory, file, lineNumber, name;
      lineNumber = _arg.lineNumber, name = _arg.name, file = _arg.file, directory = _arg.directory;
      return $$(function() {
        return this.li({
          "class": 'two-lines'
        }, (function(_this) {
          return function() {
            _this.div("" + name + ":" + lineNumber, {
              "class": 'primary-line'
            });
            return _this.div(file, {
              "class": 'secondary-line'
            });
          };
        })(this));
      });
    };

    SymbolsView.prototype.getEmptyMessage = function(itemCount) {
      if (itemCount === 0) {
        return 'No symbols found';
      } else {
        return SymbolsView.__super__.getEmptyMessage.apply(this, arguments);
      }
    };

    SymbolsView.prototype.cancelled = function() {
      return this.panel.hide();
    };

    SymbolsView.prototype.confirmed = function(tag) {
      this.cancelPosition = null;
      this.cancel();
      return this.openTag(tag);
    };

    SymbolsView.prototype.getTagPosition = function(tag) {
      if (!tag.position && tag.lineNumber && tag.pattern) {
        tag.position = new Point(tag.lineNumber - 1, tag.pattern.indexOf(tag.name) - 2);
      }
      if (!tag.position) {
        console.error("Atom Ctags: please create a new issue: " + JSON.stringify(tag));
      }
      return tag.position;
    };

    SymbolsView.prototype.openTag = function(tag) {
      var editor, previous;
      if (editor = atom.workspace.getActiveTextEditor()) {
        previous = {
          position: editor.getCursorBufferPosition(),
          file: editor.getURI()
        };
      }
      if (tag.file) {
        atom.workspace.open(tag.file).done((function(_this) {
          return function() {
            if (_this.getTagPosition(tag)) {
              return _this.moveToPosition(tag.position);
            }
          };
        })(this));
      }
      return this.stack.push(previous);
    };

    SymbolsView.prototype.moveToPosition = function(position) {
      var editor;
      if (editor = atom.workspace.getActiveTextEditor()) {
        editor.scrollToBufferPosition(position, {
          center: true
        });
        return editor.setCursorBufferPosition(position);
      }
    };

    SymbolsView.prototype.attach = function() {
      this.storeFocusedElement();
      this.panel.show();
      return this.focusFilterEditor();
    };

    return SymbolsView;

  })(SelectListView);

}).call(this);
