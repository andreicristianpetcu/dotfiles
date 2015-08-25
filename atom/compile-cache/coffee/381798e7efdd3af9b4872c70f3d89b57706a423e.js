(function() {
  var Point, Range, Rename, RenameView, path, _, _ref;

  RenameView = require('./atom-ternjs-rename-view');

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  _ = require('underscore-plus');

  path = require('path');

  module.exports = Rename = (function() {
    Rename.prototype.renameView = null;

    Rename.prototype.manager = null;

    function Rename(manager, state) {
      if (state == null) {
        state = {};
      }
      this.manager = manager;
      this.renameView = new RenameView();
      this.renameView.initialize(this);
      this.renamePanel = atom.workspace.addBottomPanel({
        item: this.renameView,
        priority: 0
      });
      this.renamePanel.hide();
      atom.views.getView(this.renamePanel).classList.add('atom-ternjs-rename-panel', 'panel-bottom');
    }

    Rename.prototype.hide = function() {
      var _ref1;
      if (!((_ref1 = this.renamePanel) != null ? _ref1.isVisible() : void 0)) {
        return;
      }
      this.renamePanel.hide();
      return this.manager.helper.focusEditor();
    };

    Rename.prototype.show = function() {
      var codeEditor, currentName, currentNameRange;
      codeEditor = atom.workspace.getActiveTextEditor();
      currentNameRange = codeEditor.getLastCursor().getCurrentWordBufferRange({
        includeNonWordCharacters: false
      });
      currentName = codeEditor.getTextInBufferRange(currentNameRange);
      this.renameView.nameEditor.getModel().setText(currentName);
      this.renameView.nameEditor.getModel().selectAll();
      this.renamePanel.show();
      return this.renameView.nameEditor.focus();
    };

    Rename.prototype.updateAllAndRename = function(newName) {
      var editor, editors, idx, _i, _len, _results;
      if (!this.manager.client) {
        return;
      }
      idx = 0;
      editors = atom.workspace.getTextEditors();
      _results = [];
      for (_i = 0, _len = editors.length; _i < _len; _i++) {
        editor = editors[_i];
        if (!this.manager.isValidEditor(editor)) {
          idx++;
          continue;
        }
        if (atom.project.relativizePath(editor.getURI())[0] !== this.manager.client.rootPath) {
          idx++;
          continue;
        }
        _results.push(this.manager.client.update(editor.getURI(), editor.getText()).then((function(_this) {
          return function() {
            var cursor, position;
            if (++idx === editors.length) {
              editor = atom.workspace.getActiveTextEditor();
              cursor = editor.getLastCursor();
              if (!cursor) {
                return;
              }
              position = cursor.getBufferPosition();
              return _this.manager.client.rename(editor.getURI(), {
                line: position.row,
                ch: position.column
              }, newName).then(function(data) {
                if (!data) {
                  return;
                }
                return _this.rename(data);
              }, function(err) {
                var content;
                content = "atom-ternjs<br />" + err.responseText;
                return atom.notifications.addError(content, {
                  dismissable: false
                });
              });
            }
          };
        })(this)));
      }
      return _results;
    };

    Rename.prototype.rename = function(obj) {
      var arr, arrObj, change, changes, currentFile, dir, idx, translateColumnBy, _i, _j, _k, _len, _len1, _len2, _ref1, _results;
      dir = this.manager.server.rootPath;
      if (!dir) {
        return;
      }
      translateColumnBy = obj.changes[0].text.length - obj.name.length;
      _ref1 = obj.changes;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        change = _ref1[_i];
        change.file = change.file.replace(/^.\//, '');
        change.file = path.resolve(atom.project.relativizePath(dir)[0], change.file);
      }
      changes = _.uniq(obj.changes, (function(_this) {
        return function(item) {
          return JSON.stringify(item);
        };
      })(this));
      currentFile = false;
      arr = [];
      idx = 0;
      for (_j = 0, _len1 = changes.length; _j < _len1; _j++) {
        change = changes[_j];
        if (currentFile !== change.file) {
          currentFile = change.file;
          idx = (arr.push([])) - 1;
        }
        arr[idx].push(change);
      }
      _results = [];
      for (_k = 0, _len2 = arr.length; _k < _len2; _k++) {
        arrObj = arr[_k];
        _results.push(this.openFilesAndRename(arrObj, translateColumnBy));
      }
      return _results;
    };

    Rename.prototype.openFilesAndRename = function(obj, translateColumnBy) {
      return atom.workspace.open(obj[0].file).then((function(_this) {
        return function(textEditor) {
          var buffer, change, currentColumnOffset, i, _i, _len, _results;
          currentColumnOffset = 0;
          buffer = textEditor.getBuffer();
          _results = [];
          for (i = _i = 0, _len = obj.length; _i < _len; i = ++_i) {
            change = obj[i];
            _this.setTextInRange(buffer, change, currentColumnOffset, i === obj.length - 1, textEditor);
            _results.push(currentColumnOffset += translateColumnBy);
          }
          return _results;
        };
      })(this));
    };

    Rename.prototype.setTextInRange = function(buffer, change, offset, moveCursor, textEditor) {
      var end, length, position, range, _ref1;
      change.start += offset;
      change.end += offset;
      position = buffer.positionForCharacterIndex(change.start);
      length = change.end - change.start;
      end = position.translate(new Point(0, length));
      range = new Range(position, end);
      buffer.setTextInRange(range, change.text);
      if (!moveCursor) {
        return;
      }
      return (_ref1 = textEditor.getLastCursor()) != null ? _ref1.setBufferPosition(start) : void 0;
    };

    Rename.prototype.destroy = function() {
      var _ref1, _ref2;
      if ((_ref1 = this.renameView) != null) {
        _ref1.destroy();
      }
      this.renameView = null;
      if ((_ref2 = this.renamePanel) != null) {
        _ref2.destroy();
      }
      return this.renamePanel = null;
    };

    return Rename;

  })();

}).call(this);
