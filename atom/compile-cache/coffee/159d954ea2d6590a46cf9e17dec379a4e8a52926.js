(function() {
  var $, Client;

  $ = require('jquery');

  $.ajaxSetup({
    cache: false
  });

  module.exports = Client = (function() {
    Client.prototype.port = null;

    Client.prototype.manager = null;

    Client.prototype.rootPath = null;

    Client.prototype.disposables = [];

    Client.prototype.config = {
      sort: false,
      guess: false,
      urls: false,
      origins: false,
      caseInsensitive: false,
      documentation: false
    };

    function Client(manager, rootPath) {
      this.manager = manager;
      this.rootPath = rootPath;
      this.registerEvents();
    }

    Client.prototype.registerEvents = function() {
      this.disposables.push(atom.config.observe('atom-ternjs.sort', (function(_this) {
        return function() {
          return _this.config.sort = atom.config.get('atom-ternjs.sort');
        };
      })(this)));
      this.disposables.push(atom.config.observe('atom-ternjs.guess', (function(_this) {
        return function() {
          return _this.config.guess = atom.config.get('atom-ternjs.guess');
        };
      })(this)));
      this.disposables.push(atom.config.observe('atom-ternjs.urls', (function(_this) {
        return function() {
          return _this.config.urls = atom.config.get('atom-ternjs.urls');
        };
      })(this)));
      this.disposables.push(atom.config.observe('atom-ternjs.origins', (function(_this) {
        return function() {
          return _this.config.origins = atom.config.get('atom-ternjs.origins');
        };
      })(this)));
      this.disposables.push(atom.config.observe('atom-ternjs.caseInsensitive', (function(_this) {
        return function() {
          return _this.config.caseInsensitive = atom.config.get('atom-ternjs.caseInsensitive');
        };
      })(this)));
      return this.disposables.push(atom.config.observe('atom-ternjs.documentation', (function(_this) {
        return function() {
          return _this.config.documentation = atom.config.get('atom-ternjs.documentation');
        };
      })(this)));
    };

    Client.prototype.unregisterEvents = function() {
      var disposable, _i, _len, _ref;
      _ref = this.disposables;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        disposable = _ref[_i];
        disposable.dispose();
      }
      return this.disposables = [];
    };

    Client.prototype.completions = function(file, end) {
      return this.post(JSON.stringify({
        query: {
          type: 'completions',
          file: file,
          end: end,
          types: true,
          includeKeywords: true,
          sort: this.config.sort,
          guess: this.config.guess,
          docs: this.config.documentation,
          urls: this.config.urls,
          origins: this.config.origins,
          lineCharPositions: true,
          caseInsensitive: this.config.caseInsensitive
        }
      }));
    };

    Client.prototype.refs = function(file, end) {
      return this.post(JSON.stringify({
        query: {
          type: 'refs',
          file: file,
          end: end
        }
      }));
    };

    Client.prototype.update = function(file, text) {
      return this.post(JSON.stringify({
        files: [
          {
            type: 'full',
            name: file,
            text: text
          }
        ]
      }));
    };

    Client.prototype.rename = function(file, end, newName) {
      return this.post(JSON.stringify({
        query: {
          type: 'rename',
          file: file,
          end: end,
          newName: newName
        }
      }));
    };

    Client.prototype.lint = function(file, text) {
      return this.post(JSON.stringify({
        query: {
          type: 'lint',
          file: file,
          files: [
            {
              type: 'full',
              name: file,
              text: text
            }
          ]
        }
      }));
    };

    Client.prototype.type = function(editor, position) {
      var end, file;
      file = editor.getURI();
      end = {
        line: position.row,
        ch: position.column
      };
      return this.post(JSON.stringify({
        query: {
          type: 'type',
          file: file,
          end: end,
          preferFunction: true
        }
      }));
    };

    Client.prototype.definition = function() {
      var cursor, editor, end, file, position;
      editor = atom.workspace.getActiveTextEditor();
      cursor = editor.getLastCursor();
      position = cursor.getBufferPosition();
      file = editor.getURI();
      end = {
        line: position.row,
        ch: position.column
      };
      return this.post(JSON.stringify({
        query: {
          type: 'definition',
          file: file,
          end: end
        }
      })).then((function(_this) {
        return function(data) {
          if (data != null ? data.start : void 0) {
            _this.manager.helper.setMarkerCheckpoint();
            return _this.manager.helper.openFileAndGoTo(data.start, data.file);
          }
        };
      })(this), function(err) {
        return console.log(err);
      });
    };

    Client.prototype.post = function(data) {
      return $.post("http://localhost:" + this.port, data).then(function(data) {
        return data;
      });
    };

    return Client;

  })();

}).call(this);
