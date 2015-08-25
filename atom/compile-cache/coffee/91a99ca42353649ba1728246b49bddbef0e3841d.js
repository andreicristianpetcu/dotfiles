(function() {
  var Helper, fs, path;

  fs = require('fs');

  path = require('path');

  module.exports = Helper = (function() {
    Helper.prototype.projectRoot = null;

    Helper.prototype.manager = null;

    Helper.prototype.checkpointsDefinition = [];

    function Helper(manager) {
      this.manager = manager;
    }

    Helper.prototype.updateTernFile = function(content) {
      var _ref;
      this.projectRoot = (_ref = this.manager.server) != null ? _ref.rootPath : void 0;
      if (!this.projectRoot) {
        return;
      }
      return this.writeFile(path.resolve(__dirname, this.projectRoot + '/.tern-project'), content);
    };

    Helper.prototype.fileExists = function(path) {
      var e;
      try {
        return fs.accessSync(path, fs.F_OK, (function(_this) {
          return function(err) {
            return console.log(err);
          };
        })(this));
      } catch (_error) {
        e = _error;
        return false;
      }
    };

    Helper.prototype.writeFile = function(filePath, content) {
      return fs.writeFile(filePath, content, (function(_this) {
        return function(err) {
          var message;
          atom.workspace.open(filePath);
          if (!err) {
            return;
          }
          message = 'Could not create/update .tern-project file. Use the README to manually create a .tern-project file.';
          return atom.notifications.addInfo(message, {
            dismissable: true
          });
        };
      })(this));
    };

    Helper.prototype.readFile = function(path) {
      return fs.readFileSync(path, 'utf8');
    };

    Helper.prototype.getFileContent = function(filePath, projectRoot) {
      var resolvedPath, _ref;
      this.projectRoot = (_ref = this.manager.server) != null ? _ref.rootPath : void 0;
      if (!this.projectRoot) {
        return false;
      }
      if (projectRoot) {
        filePath = this.projectRoot + filePath;
      }
      resolvedPath = path.resolve(__dirname, filePath);
      if (this.fileExists(resolvedPath) !== void 0) {
        return false;
      }
      return this.readFile(resolvedPath);
    };

    Helper.prototype.markerCheckpointBack = function() {
      var checkpoint;
      if (!this.checkpointsDefinition.length) {
        return;
      }
      checkpoint = this.checkpointsDefinition.pop();
      return this.openFileAndGoToPosition(checkpoint.marker.getRange().start, checkpoint.editor.getURI());
    };

    Helper.prototype.setMarkerCheckpoint = function() {
      var buffer, cursor, editor, marker;
      editor = atom.workspace.getActiveTextEditor();
      buffer = editor.getBuffer();
      cursor = editor.getLastCursor();
      if (!cursor) {
        return;
      }
      marker = buffer.markPosition(cursor.getBufferPosition(), {});
      return this.checkpointsDefinition.push({
        marker: marker,
        editor: editor
      });
    };

    Helper.prototype.openFileAndGoToPosition = function(position, file) {
      return atom.workspace.open(file).then(function(textEditor) {
        var buffer, cursor;
        buffer = textEditor.getBuffer();
        cursor = textEditor.getLastCursor();
        return cursor.setBufferPosition(position);
      });
    };

    Helper.prototype.openFileAndGoTo = function(start, file) {
      return atom.workspace.open(file).then((function(_this) {
        return function(textEditor) {
          var buffer, cursor;
          buffer = textEditor.getBuffer();
          cursor = textEditor.getLastCursor();
          cursor.setBufferPosition(buffer.positionForCharacterIndex(start));
          return _this.markDefinitionBufferRange(cursor, textEditor);
        };
      })(this));
    };

    Helper.prototype.formatType = function(data) {
      if (!data.type) {
        return;
      }
      data.type = data.type.replace(/->/g, ':').replace('<top>', 'window');
      return data.type = data.type.replace(/^fn/, data.exprName);
    };

    Helper.prototype.prepareType = function(data) {
      var type;
      if (!data.type) {
        return;
      }
      return type = data.type.replace(/->/g, ':').replace('<top>', 'window');
    };

    Helper.prototype.formatTypeCompletion = function(obj) {
      var params, _ref;
      if (obj.isKeyword) {
        obj._typeSelf = 'keyword';
      }
      if (!obj.type) {
        return obj;
      }
      if (!obj.type.startsWith('fn')) {
        obj._typeSelf = 'variable';
      }
      if (obj.type === 'string') {
        obj.name = (_ref = obj.name) != null ? _ref.replace(/(^"|"$)/g, '') : void 0;
      }
      obj.type = obj.rightLabel = this.prepareType(obj);
      if (obj.type.replace(/fn\(.+\)/, '').length === 0) {
        obj.leftLabel = '';
      } else {
        if (obj.type.indexOf('fn') === -1) {
          obj.leftLabel = obj.type;
        } else {
          obj.leftLabel = obj.type.replace(/fn\(.{0,}\)/, '').replace(' : ', '');
        }
      }
      if (obj.rightLabel.startsWith('fn')) {
        params = this.extractParams(obj.rightLabel);
        if (this.manager.useSnippets || this.manager.useSnippetsAndFunction) {
          obj._snippet = this.buildSnippet(params, obj.name);
          obj._hasParams = params.length ? true : false;
        } else {
          if (this.manager.doNotAddParantheses) {
            obj._snippet = "" + obj.name;
          } else {
            obj._snippet = params.length ? "" + obj.name + "(${" + 0 + ":" + "})" : "" + obj.name + "()";
          }
        }
        obj._typeSelf = 'function';
      }
      if (obj.name) {
        if (obj.leftLabel === obj.name) {
          obj.leftLabel = null;
          obj.rightLabel = null;
        }
      }
      if (obj.leftLabel === obj.rightLabel) {
        obj.rightLabel = null;
      }
      return obj;
    };

    Helper.prototype.buildSnippet = function(params, name) {
      var i, param, suggestionParams, _i, _len;
      if (params.length === 0) {
        return "" + name + "()";
      }
      suggestionParams = [];
      for (i = _i = 0, _len = params.length; _i < _len; i = ++_i) {
        param = params[i];
        suggestionParams.push("${" + (i + 1) + ":" + param + "}");
      }
      return "" + name + "(" + (suggestionParams.join(',')) + ")";
    };

    Helper.prototype.extractParams = function(type) {
      var i, inside, param, params, start, _i, _ref;
      if (!type) {
        return [];
      }
      start = type.indexOf('(') + 1;
      params = [];
      inside = 0;
      for (i = _i = start, _ref = type.length - 1; start <= _ref ? _i <= _ref : _i >= _ref; i = start <= _ref ? ++_i : --_i) {
        if (type[i] === ':' && inside === -1) {
          params.push(type.substring(start, i - 2));
          break;
        }
        if (i === type.length - 1) {
          param = type.substring(start, i);
          if (param.length) {
            params.push(param);
          }
          break;
        }
        if (type[i] === ',' && inside === 0) {
          params.push(type.substring(start, i));
          start = i + 1;
          continue;
        }
        if (type[i].match(/[{\[\(]/)) {
          inside++;
          continue;
        }
        if (type[i].match(/[}\]\)]/)) {
          inside--;
        }
      }
      return params;
    };

    Helper.prototype.markDefinitionBufferRange = function(cursor, editor) {
      var decoration, marker, range;
      range = cursor.getCurrentWordBufferRange();
      marker = editor.markBufferRange(range, {
        invalidate: 'touch'
      });
      decoration = editor.decorateMarker(marker, {
        type: 'highlight',
        "class": 'atom-ternjs-definition-marker',
        invalidate: 'touch'
      });
      setTimeout((function() {
        return decoration != null ? decoration.setProperties({
          type: 'highlight',
          "class": 'atom-ternjs-definition-marker active',
          invalidate: 'touch'
        }) : void 0;
      }), 1);
      setTimeout((function() {
        return decoration != null ? decoration.setProperties({
          type: 'highlight',
          "class": 'atom-ternjs-definition-marker',
          invalidate: 'touch'
        }) : void 0;
      }), 1501);
      return setTimeout((function() {
        return marker.destroy();
      }), 2500);
    };

    Helper.prototype.focusEditor = function() {
      var editor, view;
      editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return;
      }
      view = atom.views.getView(editor);
      return view != null ? typeof view.focus === "function" ? view.focus() : void 0 : void 0;
    };

    Helper.prototype.destroy = function() {
      var checkpoint, _i, _len, _ref, _ref1, _results;
      _ref = this.checkpointsDefinition;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        checkpoint = _ref[_i];
        _results.push((_ref1 = checkpoint.marker) != null ? _ref1.destroy() : void 0);
      }
      return _results;
    };

    return Helper;

  })();

}).call(this);
