(function() {
  var Point, Range, editorUtils, emmet, insertSnippet, normalize, path, preprocessSnippet, resources, tabStops, utils, visualize, _ref;

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  path = require('path');

  emmet = require('emmet');

  utils = require('emmet/lib/utils/common');

  tabStops = require('emmet/lib/assets/tabStops');

  resources = require('emmet/lib/assets/resources');

  editorUtils = require('emmet/lib/utils/editor');

  insertSnippet = function(snippet, editor) {
    var _ref1, _ref2, _ref3, _ref4;
    if ((_ref1 = atom.packages.getLoadedPackage('snippets')) != null) {
      if ((_ref2 = _ref1.mainModule) != null) {
        _ref2.insert(snippet, editor);
      }
    }
    return editor.snippetExpansion = (_ref3 = atom.packages.getLoadedPackage('snippets')) != null ? (_ref4 = _ref3.mainModule) != null ? _ref4.getExpansions(editor)[0] : void 0 : void 0;
  };

  visualize = function(str) {
    return str.replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\s/g, '\\s');
  };

  normalize = function(text, editor) {
    return editorUtils.normalize(text, {
      indentation: editor.getTabText(),
      newline: '\n'
    });
  };

  preprocessSnippet = function(value) {
    var order, tabstopOptions;
    order = [];
    tabstopOptions = {
      tabstop: function(data) {
        var group, placeholder;
        group = parseInt(data.group, 10);
        if (group === 0) {
          order.push(-1);
          group = order.length;
        } else {
          if (order.indexOf(group) === -1) {
            order.push(group);
          }
          group = order.indexOf(group) + 1;
        }
        placeholder = data.placeholder || '';
        if (placeholder) {
          placeholder = tabStops.processText(placeholder, tabstopOptions);
        }
        if (placeholder) {
          return "${" + group + ":" + placeholder + "}";
        } else {
          return "$" + group;
        }
      },
      escape: function(ch) {
        if (ch === '$') {
          return '\\$';
        } else {
          return ch;
        }
      }
    };
    return tabStops.processText(value, tabstopOptions);
  };

  module.exports = {
    setup: function(editor, selectionIndex) {
      var buf, bufRanges;
      this.editor = editor;
      this.selectionIndex = selectionIndex != null ? selectionIndex : 0;
      buf = this.editor.getBuffer();
      bufRanges = this.editor.getSelectedBufferRanges();
      return this._selection = {
        index: 0,
        saved: new Array(bufRanges.length),
        bufferRanges: bufRanges,
        indexRanges: bufRanges.map(function(range) {
          return {
            start: buf.characterIndexForPosition(range.start),
            end: buf.characterIndexForPosition(range.end)
          };
        })
      };
    },
    exec: function(fn) {
      var ix, success;
      ix = this._selection.bufferRanges.length - 1;
      this._selection.saved = [];
      success = true;
      while (ix >= 0) {
        this._selection.index = ix;
        if (fn(this._selection.index) === false) {
          success = false;
          break;
        }
        ix--;
      }
      if (success && this._selection.saved.length > 1) {
        return this._setSelectedBufferRanges(this._selection.saved);
      }
    },
    _setSelectedBufferRanges: function(sels) {
      var filteredSels;
      filteredSels = sels.filter(function(s) {
        return !!s;
      });
      if (filteredSels.length) {
        return this.editor.setSelectedBufferRanges(filteredSels);
      }
    },
    _saveSelection: function(delta) {
      var i, range, _results;
      this._selection.saved[this._selection.index] = this.editor.getSelectedBufferRange();
      if (delta) {
        i = this._selection.index;
        delta = Point.fromObject([delta, 0]);
        _results = [];
        while (++i < this._selection.saved.length) {
          range = this._selection.saved[i];
          if (range) {
            _results.push(this._selection.saved[i] = new Range(range.start.translate(delta), range.end.translate(delta)));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    },
    selectionList: function() {
      return this._selection.indexRanges;
    },
    getCaretPos: function() {
      return this.getSelectionRange().start;
    },
    setCaretPos: function(pos) {
      return this.createSelection(pos);
    },
    getSelectionRange: function() {
      return this._selection.indexRanges[this._selection.index];
    },
    getSelectionBufferRange: function() {
      return this._selection.bufferRanges[this._selection.index];
    },
    createSelection: function(start, end) {
      var buf, sels;
      if (end == null) {
        end = start;
      }
      sels = this._selection.bufferRanges;
      buf = this.editor.getBuffer();
      sels[this._selection.index] = new Range(buf.positionForCharacterIndex(start), buf.positionForCharacterIndex(end));
      return this._setSelectedBufferRanges(sels);
    },
    getSelection: function() {
      return this.editor.getTextInBufferRange(this.getSelectionBufferRange());
    },
    getCurrentLineRange: function() {
      var index, lineLength, row, sel;
      sel = this.getSelectionBufferRange();
      row = sel.getRows()[0];
      lineLength = this.editor.lineTextForBufferRow(row).length;
      index = this.editor.getBuffer().characterIndexForPosition({
        row: row,
        column: 0
      });
      return {
        start: index,
        end: index + lineLength
      };
    },
    getCurrentLine: function() {
      var row, sel;
      sel = this.getSelectionBufferRange();
      row = sel.getRows()[0];
      return this.editor.lineTextForBufferRow(row);
    },
    getContent: function() {
      return this.editor.getText();
    },
    replaceContent: function(value, start, end, noIndent) {
      var buf, caret, changeRange, oldValue;
      if (end == null) {
        end = start == null ? this.getContent().length : start;
      }
      if (start == null) {
        start = 0;
      }
      value = normalize(value, this.editor);
      buf = this.editor.getBuffer();
      changeRange = new Range(Point.fromObject(buf.positionForCharacterIndex(start)), Point.fromObject(buf.positionForCharacterIndex(end)));
      oldValue = this.editor.getTextInBufferRange(changeRange);
      buf.setTextInRange(changeRange, '');
      caret = buf.positionForCharacterIndex(start);
      this.editor.setSelectedBufferRange(new Range(caret, caret));
      insertSnippet(preprocessSnippet(value), this.editor);
      this._saveSelection(utils.splitByLines(value).length - utils.splitByLines(oldValue).length);
      return value;
    },
    getGrammar: function() {
      return this.editor.getGrammar().name.toLowerCase();
    },
    getSyntax: function() {
      var embedded, m, syntax;
      syntax = this.getGrammar().split(' ')[0];
      if (!resources.hasSyntax(syntax)) {
        syntax = "html";
      }
      if (/\b(javascript|jsx)\b/.test(syntax)) {
        syntax = this.getCurrentScope().some(function(scope) {
          return /\bstring\b/.test(scope);
        }) ? 'html' : 'jsx';
      }
      if (syntax === 'html') {
        embedded = this.getCurrentScope().filter(function(s) {
          return /\.embedded\./.test(s);
        }).pop();
        if (embedded) {
          m = embedded.match(/source\.(.+?)\.embedded/);
          if (m) {
            syntax = m[1];
          }
        }
      }
      return syntax;
    },
    getCurrentScope: function() {
      var range;
      range = this._selection.bufferRanges[this._selection.index];
      return this.editor.scopeDescriptorForBufferPosition(range.start).getScopesArray();
    },
    getProfileName: function() {
      if (this.getCurrentScope().some(function(scope) {
        return /\bstring\.quoted\b/.test(scope);
      })) {
        return 'line';
      } else {
        return 'html';
      }
    },
    getFilePath: function() {
      return this.editor.buffer.file.path;
    }
  };

}).call(this);
