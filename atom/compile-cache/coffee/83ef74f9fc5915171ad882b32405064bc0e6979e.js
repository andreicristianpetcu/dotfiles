(function() {
  var Module, NonEditableEditorView, PROTOCOL, Promise, cleanupListener, currentMarker, exists, fs, url;

  Promise = require('bluebird');

  fs = require('fs');

  url = require('url');

  Module = require('module');

  NonEditableEditorView = require('./non-editable-editor');

  PROTOCOL = 'atom-node-debugger://';

  currentMarker = null;

  cleanupListener = null;

  exists = function(path) {
    return new Promise(function(resolve) {
      return fs.exists(path, function(isExisted) {
        return resolve(isExisted);
      });
    });
  };

  module.exports = function(_debugger) {
    atom.workspace.addOpener(function(filename, opts) {
      var parsed;
      parsed = url.parse(filename, true);
      if (parsed.protocol === 'atom-node-debugger:') {
        return new NonEditableEditorView({
          uri: filename,
          id: parsed.host,
          _debugger: _debugger,
          query: opts
        });
      }
    });
    return cleanupListener = _debugger.onBreak(function(breakpoint) {
      var id, script, sourceColumn, sourceLine, _ref;
      if (currentMarker != null) {
        currentMarker.destroy();
      }
      sourceLine = breakpoint.sourceLine, sourceColumn = breakpoint.sourceColumn;
      script = breakpoint.script && breakpoint.script.name;
      id = (_ref = breakpoint.script) != null ? _ref.id : void 0;
      return exists(script).then(function(isExisted) {
        var newSourceName, promise;
        if (isExisted) {
          promise = atom.workspace.open(script, {
            initialLine: sourceLine,
            initialColumn: sourceColumn,
            activatePane: true,
            searchAllPanes: true
          });
        } else {
          if (id == null) {
            return;
          }
          newSourceName = "" + PROTOCOL + id;
          promise = atom.workspace.open(newSourceName, {
            initialColumn: sourceColumn,
            initialLine: sourceLine,
            name: script,
            searchAllPanes: true
          });
        }
        return promise;
      }).then(function(editor) {
        if (editor == null) {
          return;
        }
        currentMarker = editor.markBufferPosition([sourceLine, sourceColumn]);
        return editor.decorateMarker(currentMarker, {
          type: 'line-number',
          "class": 'node-debugger-stop-line'
        });
      });
    });
  };

  module.exports.cleanup = function() {
    if (currentMarker != null) {
      return currentMarker.destroy();
    }
  };

  module.exports.destroy = function() {
    module.exports.cleanup();
    if (cleanupListener != null) {
      return cleanupListener();
    }
  };

}).call(this);
