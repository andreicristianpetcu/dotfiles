(function() {
  var PathsProvider, Range, fs, fuzzaldrin, path,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Range = require('atom').Range;

  fuzzaldrin = require('fuzzaldrin');

  path = require('path');

  fs = require('fs');

  module.exports = PathsProvider = (function() {
    function PathsProvider() {
      this.dispose = __bind(this.dispose, this);
      this.prefixForCursor = __bind(this.prefixForCursor, this);
      this.requestHandler = __bind(this.requestHandler, this);
    }

    PathsProvider.prototype.id = 'autocomplete-paths-pathsprovider';

    PathsProvider.prototype.selector = '*';

    PathsProvider.prototype.wordRegex = /[a-zA-Z0-9\.\/_-]*\/[a-zA-Z0-9\.\/_-]*/g;

    PathsProvider.prototype.cache = [];

    PathsProvider.prototype.requestHandler = function(options) {
      var basePath, editorPath, prefix, suggestions, _ref;
      if (options == null) {
        options = {};
      }
      if (!((options.editor != null) && (options.buffer != null) && (options.cursor != null))) {
        return [];
      }
      editorPath = (_ref = options.editor) != null ? _ref.getPath() : void 0;
      if (!(editorPath != null ? editorPath.length : void 0)) {
        return [];
      }
      basePath = path.dirname(editorPath);
      if (basePath == null) {
        return [];
      }
      prefix = this.prefixForCursor(options.editor, options.buffer, options.cursor, options.position);
      if (!prefix.length) {
        return [];
      }
      suggestions = this.findSuggestionsForPrefix(options.editor, basePath, prefix);
      if (!suggestions.length) {
        return [];
      }
      return suggestions;
    };

    PathsProvider.prototype.prefixForCursor = function(editor, buffer, cursor, position) {
      var end, start;
      if (!((buffer != null) && (cursor != null))) {
        return '';
      }
      start = this.getBeginningOfCurrentWordBufferPosition(editor, position, {
        wordRegex: this.wordRegex
      });
      end = cursor.getBufferPosition();
      if (!((start != null) && (end != null))) {
        return '';
      }
      return buffer.getTextInRange(new Range(start, end));
    };

    PathsProvider.prototype.getBeginningOfCurrentWordBufferPosition = function(editor, position, options) {
      var allowPrevious, beginningOfWordPosition, currentBufferPosition, scanRange, _ref;
      if (options == null) {
        options = {};
      }
      if (position == null) {
        return;
      }
      allowPrevious = (_ref = options.allowPrevious) != null ? _ref : true;
      currentBufferPosition = position;
      scanRange = [[currentBufferPosition.row, 0], currentBufferPosition];
      beginningOfWordPosition = null;
      editor.backwardsScanInBufferRange(options.wordRegex, scanRange, function(_arg) {
        var range, stop;
        range = _arg.range, stop = _arg.stop;
        if (range.end.isGreaterThanOrEqual(currentBufferPosition) || allowPrevious) {
          beginningOfWordPosition = range.start;
        }
        if (!(beginningOfWordPosition != null ? beginningOfWordPosition.isEqual(currentBufferPosition) : void 0)) {
          return stop();
        }
      });
      if (beginningOfWordPosition != null) {
        return beginningOfWordPosition;
      } else if (allowPrevious) {
        return [currentBufferPosition.row, 0];
      } else {
        return currentBufferPosition;
      }
    };

    PathsProvider.prototype.findSuggestionsForPrefix = function(editor, basePath, prefix) {
      var directory, e, files, label, prefixPath, result, resultPath, results, stat, suggestion, suggestions;
      if (basePath == null) {
        return [];
      }
      prefixPath = path.resolve(basePath, prefix);
      if (prefix.endsWith('/')) {
        directory = prefixPath;
        prefix = '';
      } else {
        if (basePath === prefixPath) {
          directory = prefixPath;
        } else {
          directory = path.dirname(prefixPath);
        }
        prefix = path.basename(prefix);
      }
      try {
        stat = fs.statSync(directory);
        if (!stat.isDirectory()) {
          return [];
        }
      } catch (_error) {
        e = _error;
        return [];
      }
      try {
        files = fs.readdirSync(directory);
      } catch (_error) {
        e = _error;
        return [];
      }
      results = fuzzaldrin.filter(files, prefix);
      suggestions = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = results.length; _i < _len; _i++) {
          result = results[_i];
          resultPath = path.resolve(directory, result);
          try {
            stat = fs.statSync(resultPath);
          } catch (_error) {
            e = _error;
            continue;
          }
          if (stat.isDirectory()) {
            label = 'Dir';
            result += path.sep;
          } else if (stat.isFile()) {
            label = 'File';
          } else {
            continue;
          }
          suggestion = {
            word: result,
            prefix: prefix,
            label: label,
            data: {
              body: result
            }
          };
          if (suggestion.label !== 'File') {
            suggestion.onDidConfirm = function() {
              return atom.commands.dispatch(atom.views.getView(editor), 'autocomplete-plus:activate');
            };
          }
          _results.push(suggestion);
        }
        return _results;
      })();
      return suggestions;
    };

    PathsProvider.prototype.dispose = function() {
      this.editor = null;
      return this.basePath = null;
    };

    return PathsProvider;

  })();

}).call(this);
