(function() {
  var $, Module, NonEditableEditorView, TextEditorView, View, path, removeModuleWrapper, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  Module = require('module');

  path = require('path');

  removeModuleWrapper = function(str) {
    var lines, popItem;
    lines = str.split('\n');
    lines = lines.filter(function(line) {
      if (line === Module.wrapper[0]) {
        return false;
      }
      return true;
    });
    lines = lines.map(function(line) {
      if (line.indexOf(Module.wrapper[0]) >= 0) {
        return line.replace(Module.wrapper[0], '');
      }
      return line;
    });
    popItem = null;
    lines.pop();
    return lines.join('\n');
  };

  module.exports = NonEditableEditorView = (function(_super) {
    __extends(NonEditableEditorView, _super);

    function NonEditableEditorView() {
      return NonEditableEditorView.__super__.constructor.apply(this, arguments);
    }

    NonEditableEditorView.content = TextEditorView.content;

    NonEditableEditorView.prototype.initialize = function(opts) {
      this.uri = opts.uri, this._debugger = opts._debugger;
      if (opts.script) {
        this.id = opts.script.id;
        this.onDone();
        return this.setText(removeModuleWrapper(script.source));
      }
      if (opts.id) {
        this.id = opts.id;
        this._debugger.getScriptById(this.id).then((function(_this) {
          return function(script) {
            _this.script = script;
            _this.setText(removeModuleWrapper(script.source));
            return _this.onDone();
          };
        })(this)).then((function(_this) {
          return function() {};
        })(this));
      }
      return this.title = opts.query.name;
    };

    NonEditableEditorView.prototype.onDone = function() {
      var extname, grammar;
      extname = path.extname(this.script.name);
      if (extname === '.js') {
        grammar = atom.grammars.grammarForScopeName('source.js');
      } else if (extname === '.coffee') {
        grammar = atom.grammars.grammarForScopeName('source.coffee');
      } else {
        return;
      }
      return this.getModel().setGrammar(grammar);
    };

    NonEditableEditorView.prototype.setCursorBufferPosition = function(opts) {
      return this.getModel().setCursorBufferPosition(opts, {
        autoscroll: true
      });
    };

    NonEditableEditorView.prototype.markBufferPosition = function(opts) {
      return this.getModel().markBufferPosition(opts);
    };

    NonEditableEditorView.prototype.decorateMarker = function(marker, opts) {
      return this.getModel().decorateMarker(marker, opts);
    };

    NonEditableEditorView.prototype.serialize = function() {
      return {
        uri: this.uri,
        id: this.id,
        script: this.script
      };
    };

    NonEditableEditorView.prototype.deserialize = function(state) {
      return new NonEditableEditorView(state);
    };

    NonEditableEditorView.prototype.getTitle = function() {
      return this.title || 'NativeScript';
    };

    NonEditableEditorView.prototype.getUri = function() {
      return this.uri;
    };

    return NonEditableEditorView;

  })(TextEditorView);

}).call(this);
