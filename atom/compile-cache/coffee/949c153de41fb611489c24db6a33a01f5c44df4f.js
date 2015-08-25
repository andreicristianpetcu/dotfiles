(function() {
  var EventEmitter2, Watcher, locationDataToRange,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter2 = require('eventemitter2').EventEmitter2;

  locationDataToRange = require('./location_data_util').locationDataToRange;

  module.exports = Watcher = (function(_super) {
    __extends(Watcher, _super);

    function Watcher(moduleManager, editor) {
      this.moduleManager = moduleManager;
      this.editor = editor;
      this.onCursorMovedAfter = __bind(this.onCursorMovedAfter, this);
      this.onCursorMoved = __bind(this.onCursorMoved, this);
      this.onBufferChanged = __bind(this.onBufferChanged, this);
      this.abort = __bind(this.abort, this);
      this.createErrors = __bind(this.createErrors, this);
      this.onParseEnd = __bind(this.onParseEnd, this);
      this.parse = __bind(this.parse, this);
      this.verifyGrammar = __bind(this.verifyGrammar, this);
      this.onDestroyed = __bind(this.onDestroyed, this);
      this.destruct = __bind(this.destruct, this);
      Watcher.__super__.constructor.call(this);
      this.editor.onDidChangeCursorPosition(this.onCursorMoved);
      this.editor.onDidDestroy(this.onDestroyed);
      this.editor.onDidChange(this.onBufferChanged);
      this.moduleManager.on('changed', this.verifyGrammar);
      this.verifyGrammar();
    }

    Watcher.prototype.destruct = function() {
      this.removeAllListeners();
      this.deactivate();
      this.moduleManager.off('changed', this.verifyGrammar);
      delete this.moduleManager;
      delete this.editor;
      return delete this.module;
    };

    Watcher.prototype.onDestroyed = function() {
      if (!this.eventDestroyed) {
        return;
      }
      return this.emit('destroyed', this);
    };


    /*
    Grammar valification process
    1. Detect grammar changed.
    2. Destroy instances and listeners.
    3. Exit process when the language plugin of the grammar can't be found.
    4. Create instances and listeners.
     */

    Watcher.prototype.verifyGrammar = function() {
      var module, scopeName;
      scopeName = this.editor.getGrammar().scopeName;
      module = this.moduleManager.getModule(scopeName);
      if (module === this.module) {
        return;
      }
      this.deactivate();
      if (module == null) {
        return;
      }
      this.module = module;
      return this.activate();
    };

    Watcher.prototype.activate = function() {
      this.ripper = new this.module.Ripper();
      this.eventCursorMoved = true;
      this.eventDestroyed = true;
      this.eventBufferChanged = true;
      return this.parse();
    };

    Watcher.prototype.deactivate = function() {
      var _ref;
      this.cursorMoved = false;
      this.eventCursorMoved = false;
      this.eventDestroyed = false;
      this.eventBufferChanged = false;
      clearTimeout(this.bufferChangedTimeoutId);
      clearTimeout(this.cursorMovedTimeoutId);
      if ((_ref = this.ripper) != null) {
        _ref.destruct();
      }
      delete this.bufferChangedTimeoutId;
      delete this.cursorMovedTimeoutId;
      delete this.module;
      delete this.ripper;
      delete this.renamingCursor;
      return delete this.renamingMarkers;
    };


    /*
    Reference finder process
    1. Stop listening cursor move event and reset views.
    2. Parse.
    3. Show errors and exit process when compile error is thrown.
    4. Show references.
    5. Start listening cursor move event.
     */

    Watcher.prototype.parse = function() {
      var text;
      this.eventCursorMoved = false;
      this.destroyReferences();
      this.destroyErrors();
      text = this.editor.buffer.getText();
      if (text !== this.cachedText) {
        this.cachedText = text;
        return this.ripper.parse(text, this.onParseEnd);
      } else {
        return this.onParseEnd();
      }
    };

    Watcher.prototype.onParseEnd = function(errors) {
      if (errors != null) {
        return this.createErrors(errors);
      } else {
        this.createReferences();
        this.eventCursorMoved = false;
        return this.eventCursorMoved = true;
      }
    };

    Watcher.prototype.destroyErrors = function() {
      var marker, _i, _len, _ref;
      if (this.errorMarkers == null) {
        return;
      }
      _ref = this.errorMarkers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        marker.destroy();
      }
      return delete this.errorMarkers;
    };

    Watcher.prototype.createErrors = function(errors) {
      var location, marker, message, range;
      return this.errorMarkers = (function() {
        var _i, _len, _ref, _results;
        _results = [];
        for (_i = 0, _len = errors.length; _i < _len; _i++) {
          _ref = errors[_i], location = _ref.location, range = _ref.range, message = _ref.message;
          if (location != null) {
            range = locationDataToRange(location);
          }
          marker = this.editor.markBufferRange(range);
          this.editor.decorateMarker(marker, {
            type: 'highlight',
            "class": 'refactor-error'
          });
          this.editor.decorateMarker(marker, {
            type: 'gutter',
            "class": 'refactor-error'
          });
          _results.push(marker);
        }
        return _results;
      }).call(this);
    };

    Watcher.prototype.destroyReferences = function() {
      var marker, _i, _len, _ref;
      if (this.referenceMarkers == null) {
        return;
      }
      _ref = this.referenceMarkers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        marker.destroy();
      }
      return delete this.referenceMarkers;
    };

    Watcher.prototype.createReferences = function() {
      var marker, range, ranges;
      ranges = this.ripper.find(this.editor.getSelectedBufferRange().start);
      return this.referenceMarkers = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = ranges.length; _i < _len; _i++) {
          range = ranges[_i];
          marker = this.editor.markBufferRange(range);
          this.editor.decorateMarker(marker, {
            type: 'highlight',
            "class": 'refactor-reference'
          });
          _results.push(marker);
        }
        return _results;
      }).call(this);
    };


    /*
    Renaming life cycle.
    1. When detected rename command, start renaming process.
    2. When the cursors move out from the symbols, abort and exit renaming process.
    3. When detected done command, exit renaming process.
     */

    Watcher.prototype.rename = function() {
      var cursor, marker, range, ranges;
      if (!this.isActive()) {
        return false;
      }
      cursor = this.editor.getLastCursor();
      ranges = this.ripper.find(cursor.getBufferPosition());
      if (ranges.length === 0) {
        return false;
      }
      this.destroyReferences();
      this.eventBufferChanged = false;
      this.eventCursorMoved = false;
      this.renamingCursor = cursor;
      this.renamingMarkers = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = ranges.length; _i < _len; _i++) {
          range = ranges[_i];
          this.editor.addSelectionForBufferRange(range);
          marker = this.editor.markBufferRange(range);
          this.editor.decorateMarker(marker, {
            type: 'highlight',
            "class": 'refactor-reference'
          });
          _results.push(marker);
        }
        return _results;
      }).call(this);
      this.eventCursorMoved = false;
      this.eventCursorMoved = 'abort';
      return true;
    };

    Watcher.prototype.abort = function() {
      var isMarkerContainsCursor, isMarkersContainsCursors, marker, markerRange, selectedRange, selectedRanges, _i, _j, _len, _len1, _ref;
      if (!(this.isActive() && (this.renamingCursor != null) && (this.renamingMarkers != null))) {
        return;
      }
      selectedRanges = this.editor.getSelectedBufferRanges();
      isMarkersContainsCursors = true;
      _ref = this.renamingMarkers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        markerRange = marker.getBufferRange();
        isMarkerContainsCursor = false;
        for (_j = 0, _len1 = selectedRanges.length; _j < _len1; _j++) {
          selectedRange = selectedRanges[_j];
          isMarkerContainsCursor || (isMarkerContainsCursor = markerRange.containsRange(selectedRange));
          if (isMarkerContainsCursor) {
            break;
          }
        }
        isMarkersContainsCursors && (isMarkersContainsCursors = isMarkerContainsCursor);
        if (!isMarkersContainsCursors) {
          break;
        }
      }
      if (isMarkersContainsCursors) {
        return;
      }
      return this.done();
    };

    Watcher.prototype.done = function() {
      var marker, _i, _len, _ref;
      if (!(this.isActive() && (this.renamingCursor != null) && (this.renamingMarkers != null))) {
        return false;
      }
      this.eventCursorMoved = false;
      this.editor.setCursorBufferPosition(this.renamingCursor.getBufferPosition());
      delete this.renamingCursor;
      _ref = this.renamingMarkers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        marker.destroy();
      }
      delete this.renamingMarkers;
      this.parse();
      this.eventBufferChanged = false;
      this.eventBufferChanged = true;
      this.eventCursorMoved = false;
      this.eventCursorMoved = true;
      return true;
    };


    /*
    User events
     */

    Watcher.prototype.onBufferChanged = function() {
      if (!this.eventBufferChanged) {
        return;
      }
      clearTimeout(this.bufferChangedTimeoutId);
      return this.bufferChangedTimeoutId = setTimeout(this.parse, 0);
    };

    Watcher.prototype.onCursorMoved = function() {
      if (!this.eventCursorMoved) {
        return;
      }
      if (this.eventCursorMoved === 'abort') {
        return this.abort();
      } else {
        clearTimeout(this.cursorMovedTimeoutId);
        return this.cursorMovedTimeoutId = setTimeout(this.onCursorMovedAfter, 0);
      }
    };

    Watcher.prototype.onCursorMovedAfter = function() {
      this.destroyReferences();
      return this.createReferences();
    };


    /*
    Utility
     */

    Watcher.prototype.isActive = function() {
      return (this.module != null) && atom.workspace.getActivePaneItem() === this.editor;
    };

    Watcher.prototype.rangeToRows = function(_arg) {
      var end, pixel, point, raw, rowRange, start, _i, _ref, _ref1, _results;
      start = _arg.start, end = _arg.end;
      _results = [];
      for (raw = _i = _ref = start.row, _ref1 = end.row; _i <= _ref1; raw = _i += 1) {
        rowRange = this.editor.buffer.rangeForRow(raw);
        point = {
          left: raw === start.row ? start : rowRange.start,
          right: raw === end.row ? end : rowRange.end
        };
        pixel = {
          tl: this.editorView.pixelPositionForBufferPosition(point.left),
          br: this.editorView.pixelPositionForBufferPosition(point.right)
        };
        pixel.br.top += this.editorView.lineHeight;
        _results.push(pixel);
      }
      return _results;
    };

    return Watcher;

  })(EventEmitter2);

}).call(this);
