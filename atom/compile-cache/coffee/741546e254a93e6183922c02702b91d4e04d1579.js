(function() {
  var Client, Config, Helper, Manager, Server,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Helper = require('./atom-ternjs-helper');

  Config = require('./atom-ternjs-config');

  Server = null;

  Client = null;

  module.exports = Manager = (function() {
    Manager.prototype.disposables = [];

    Manager.prototype.grammars = ['JavaScript'];

    Manager.prototype.clients = [];

    Manager.prototype.client = null;

    Manager.prototype.servers = [];

    Manager.prototype.server = null;

    Manager.prototype.helper = null;

    Manager.prototype.rename = null;

    Manager.prototype.config = null;

    Manager.prototype.useSnippets = false;

    Manager.prototype.useSnippetsAndFunction = false;

    Manager.prototype.doNotAddParantheses = false;

    Manager.prototype.type = null;

    Manager.prototype.useLint = null;

    Manager.prototype.reference = null;

    Manager.prototype.provider = null;

    Manager.prototype.initialised = false;

    Manager.prototype.inlineFnCompletion = false;

    function Manager(provider) {
      this.provider = provider;
      this.helper = new Helper(this);
      this.config = new Config(this);
      this.registerHelperCommands();
      this.provider.init(this);
      this.initServers();
      this.disposables.push(atom.project.onDidChangePaths((function(_this) {
        return function(paths) {
          _this.destroyServer(paths);
          _this.checkPaths(paths);
          return _this.setActiveServerAndClient();
        };
      })(this)));
    }

    Manager.prototype.init = function() {
      this.initialised = true;
      this.registerEvents();
      return this.registerCommands();
    };

    Manager.prototype.destroy = function() {
      var client, server, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
      _ref = this.servers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        server = _ref[_i];
        server.stop();
        server = null;
      }
      this.servers = [];
      _ref1 = this.clients;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        client = _ref1[_j];
        client.unregisterEvents();
        client = null;
      }
      this.clients = [];
      this.server = null;
      this.client = null;
      this.unregisterEventsAndCommands();
      this.provider = null;
      if ((_ref2 = this.config) != null) {
        _ref2.destroy();
      }
      this.config = null;
      if ((_ref3 = this.reference) != null) {
        _ref3.destroy();
      }
      this.reference = null;
      if ((_ref4 = this.rename) != null) {
        _ref4.destroy();
      }
      this.rename = null;
      if ((_ref5 = this.type) != null) {
        _ref5.destroy();
      }
      this.type = null;
      if ((_ref6 = this.helper) != null) {
        _ref6.destroy();
      }
      this.helper = null;
      return this.initialised = false;
    };

    Manager.prototype.unregisterEventsAndCommands = function() {
      var disposable, _i, _len, _ref;
      _ref = this.disposables;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        disposable = _ref[_i];
        disposable.dispose();
      }
      return this.disposables = [];
    };

    Manager.prototype.initServers = function() {
      var dir, dirs, i, _i, _ref, _results;
      dirs = atom.project.getDirectories();
      if (!dirs.length) {
        return;
      }
      _results = [];
      for (i = _i = 0, _ref = dirs.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        dir = atom.project.relativizePath(dirs[i].path)[0];
        _results.push(this.startServer(dir));
      }
      return _results;
    };

    Manager.prototype.startServer = function(dir) {
      var idxServer;
      if (!Server) {
        Server = require('./atom-ternjs-server');
      }
      if (this.getServerForProject(dir)) {
        return;
      }
      idxServer = this.servers.push(new Server(dir)) - 1;
      return this.servers[idxServer].start((function(_this) {
        return function(port) {
          var client, clientIdx;
          client = _this.getClientForProject(dir);
          if (!client) {
            if (!Client) {
              Client = require('./atom-ternjs-client');
            }
            clientIdx = _this.clients.push(new Client(_this, dir)) - 1;
            _this.clients[clientIdx].port = port;
          } else {
            client.port = port;
          }
          if (_this.servers.length === _this.clients.length) {
            if (!_this.initialised) {
              _this.init();
            }
            return _this.setActiveServerAndClient(dir);
          }
        };
      })(this));
    };

    Manager.prototype.setActiveServerAndClient = function(URI) {
      var activePane, client, dir, server;
      if (!URI) {
        activePane = atom.workspace.getActivePaneItem();
        URI = activePane ? typeof activePane.getURI === "function" ? activePane.getURI() : void 0 : false;
      }
      if (!URI) {
        this.server = null;
        this.client = null;
        return;
      }
      dir = atom.project.relativizePath(URI)[0];
      server = this.getServerForProject(dir);
      client = this.getClientForProject(dir);
      if (server && client) {
        this.server = server;
        this.config.gatherData();
        return this.client = client;
      } else {
        this.server = null;
        this.config.clear();
        return this.client = null;
      }
    };

    Manager.prototype.checkPaths = function(paths) {
      var dir, path, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        dir = atom.project.relativizePath(path)[0];
        _results.push(this.startServer(dir));
      }
      return _results;
    };

    Manager.prototype.destroyServer = function(paths) {
      var client, i, server, serverIdx, _i, _ref;
      if (!this.servers.length) {
        return;
      }
      serverIdx = void 0;
      for (i = _i = 0, _ref = this.servers.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (paths.indexOf(this.servers[i].rootPath) === -1) {
          serverIdx = i;
        }
      }
      if (serverIdx === void 0) {
        return;
      }
      server = this.servers[serverIdx];
      client = this.getClientForProject(server.rootPath);
      if (client != null) {
        client.unregisterEvents();
      }
      client = null;
      server.stop();
      server = null;
      return this.servers.splice(serverIdx, 1);
    };

    Manager.prototype.getServerForProject = function(rootPath) {
      var server, _i, _len, _ref;
      _ref = this.servers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        server = _ref[_i];
        if (server.rootPath === rootPath) {
          return server;
        }
      }
    };

    Manager.prototype.getClientForProject = function(rootPath) {
      var client, _i, _len, _ref;
      _ref = this.clients;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        client = _ref[_i];
        if (client.rootPath === rootPath) {
          return client;
        }
      }
    };

    Manager.prototype.isValidEditor = function(editor) {
      var _ref;
      if (!editor || editor.mini) {
        return false;
      }
      if (!editor.getGrammar) {
        return false;
      }
      if (!editor.getGrammar()) {
        return false;
      }
      if (_ref = editor.getGrammar().name, __indexOf.call(this.grammars, _ref) < 0) {
        return false;
      }
      return true;
    };

    Manager.prototype.registerEvents = function() {
      this.disposables.push(atom.commands.add('atom-text-editor', {
        'tern:references': (function(_this) {
          return function(event) {
            var Reference;
            if (!_this.reference) {
              Reference = require('./atom-ternjs-reference');
              _this.reference = new Reference(_this);
            }
            return _this.reference.findReference();
          };
        })(this)
      }));
      this.disposables.push(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          if (!_this.isValidEditor(editor)) {
            return;
          }
          _this.disposables.push(editor.onDidChangeCursorPosition(function(event) {
            var Type, _ref;
            if (_this.inlineFnCompletion) {
              if (!_this.type) {
                Type = require('./atom-ternjs-type');
                _this.type = new Type(_this);
              }
              _this.type.queryType(editor, event.cursor);
            }
            if ((_ref = _this.rename) != null) {
              _ref.hide();
            }
            if (event.textChanged) {

            }
          }));
          _this.disposables.push(editor.getBuffer().onDidChangeModified(function(modified) {
            var _ref;
            if (!modified) {
              return;
            }
            return (_ref = _this.reference) != null ? _ref.hide() : void 0;
          }));
          return _this.disposables.push(editor.getBuffer().onDidSave(function(event) {
            var _ref;
            return (_ref = _this.client) != null ? _ref.update(editor.getURI(), editor.getText()) : void 0;
          }));
        };
      })(this)));
      this.disposables.push(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(item) {
          var _ref, _ref1, _ref2, _ref3;
          if ((_ref = _this.config) != null) {
            _ref.clear();
          }
          if ((_ref1 = _this.type) != null) {
            _ref1.destroyOverlay();
          }
          if ((_ref2 = _this.rename) != null) {
            _ref2.hide();
          }
          if (!_this.isValidEditor(item)) {
            return (_ref3 = _this.reference) != null ? _ref3.hide() : void 0;
          } else {
            return _this.setActiveServerAndClient(item.getURI());
          }
        };
      })(this)));
      this.disposables.push(atom.config.observe('atom-ternjs.inlineFnCompletion', (function(_this) {
        return function() {
          var _ref;
          _this.inlineFnCompletion = atom.config.get('atom-ternjs.inlineFnCompletion');
          return (_ref = _this.type) != null ? _ref.destroyOverlay() : void 0;
        };
      })(this)));
      this.disposables.push(atom.config.observe('atom-ternjs.lint', (function(_this) {
        return function() {
          return _this.useLint = atom.config.get('atom-ternjs.lint');
        };
      })(this)));
      this.disposables.push(atom.config.observe('atom-ternjs.useSnippets', (function(_this) {
        return function(value) {
          _this.useSnippets = value;
          if (!value) {
            return;
          }
          return atom.config.set('atom-ternjs.doNotAddParantheses', false);
        };
      })(this)));
      this.disposables.push(atom.config.observe('atom-ternjs.useSnippetsAndFunction', (function(_this) {
        return function(value) {
          _this.useSnippetsAndFunction = value;
          if (!value) {
            return;
          }
          return atom.config.set('atom-ternjs.doNotAddParantheses', false);
        };
      })(this)));
      return this.disposables.push(atom.config.observe('atom-ternjs.doNotAddParantheses', (function(_this) {
        return function(value) {
          _this.doNotAddParantheses = atom.config.get('atom-ternjs.lint');
          if (!value) {
            return;
          }
          atom.config.set('atom-ternjs.useSnippets', false);
          return atom.config.set('atom-ternjs.useSnippetsAndFunction', false);
        };
      })(this)));
    };

    Manager.prototype.addGrammar = function(grammar) {
      if (this.grammars.indexOf(grammar) !== -1) {
        return;
      }
      return this.grammars.push(grammar);
    };

    Manager.prototype.removeGrammar = function(grammar) {
      var idx;
      idx = this.grammars.indexOf(grammar);
      if (idx === -1) {
        return;
      }
      return this.grammars.splice(idx, 1);
    };

    Manager.prototype.registerHelperCommands = function() {
      return this.disposables.push(atom.commands.add('atom-workspace', {
        'tern:openConfig': (function(_this) {
          return function(event) {
            if (!_this.config) {
              Config = require('./atom-ternjs-config');
              _this.config = new Config(_this);
            }
            return _this.config.show();
          };
        })(this)
      }));
    };

    Manager.prototype.registerCommands = function() {
      this.disposables.push(atom.commands.add('atom-text-editor', {
        'tern:rename': (function(_this) {
          return function(event) {
            var Rename;
            if (!_this.rename) {
              Rename = require('./atom-ternjs-rename');
              _this.rename = new Rename(_this);
            }
            return _this.rename.show();
          };
        })(this)
      }));
      this.disposables.push(atom.commands.add('atom-text-editor', {
        'tern:markerCheckpointBack': (function(_this) {
          return function(event) {
            var _ref;
            return (_ref = _this.helper) != null ? _ref.markerCheckpointBack() : void 0;
          };
        })(this)
      }));
      this.disposables.push(atom.commands.add('atom-text-editor', {
        'tern:startCompletion': (function(_this) {
          return function(event) {
            var _ref;
            return (_ref = _this.provider) != null ? _ref.forceCompletion() : void 0;
          };
        })(this)
      }));
      this.disposables.push(atom.commands.add('atom-text-editor', {
        'tern:definition': (function(_this) {
          return function(event) {
            var _ref;
            return (_ref = _this.client) != null ? _ref.definition() : void 0;
          };
        })(this)
      }));
      return this.disposables.push(atom.commands.add('atom-workspace', {
        'tern:restart': (function(_this) {
          return function(event) {
            return _this.restartServer();
          };
        })(this)
      }));
    };

    Manager.prototype.restartServer = function() {
      var dir, i, serverIdx, _i, _ref, _ref1;
      if (!this.server) {
        return;
      }
      dir = this.server.rootPath;
      for (i = _i = 0, _ref = this.servers.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (dir === this.servers[i].rootPath) {
          serverIdx = i;
          break;
        }
      }
      if ((_ref1 = this.server) != null) {
        _ref1.stop();
      }
      this.server = null;
      this.servers.splice(serverIdx, 1);
      return this.startServer(dir);
    };

    return Manager;

  })();

}).call(this);
