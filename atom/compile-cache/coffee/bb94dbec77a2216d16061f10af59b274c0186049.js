(function() {
  var Client, Debugger, Event, EventEmitter, ProcessManager, Promise, R, childprocess, dropEmpty, kill, logger, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  R = require('ramda');

  path = require('path');

  kill = require('tree-kill');

  Promise = require('bluebird');

  Client = require('_debugger').Client;

  childprocess = require('child_process');

  EventEmitter = require('events').EventEmitter;

  Event = require('geval/event');

  logger = require('./logger');

  dropEmpty = R.reject(R.isEmpty);

  ProcessManager = (function(_super) {
    __extends(ProcessManager, _super);

    function ProcessManager(atom) {
      this.atom = atom != null ? atom : atom;
      ProcessManager.__super__.constructor.call(this);
      this.process = null;
    }

    ProcessManager.prototype.start = function(file) {
      return this.cleanup().then((function(_this) {
        return function() {
          var appArgs, appPath, args, nodePath, port;
          nodePath = _this.atom.config.get('node-debugger.nodePath');
          appArgs = _this.atom.config.get('node-debugger.appArgs');
          port = _this.atom.config.get('node-debugger.debugPort');
          appPath = _this.atom.workspace.getActiveTextEditor().getPath();
          args = ["--debug-brk=" + port, file || appPath, appArgs || ''];
          logger.error('spawn', dropEmpty(args));
          _this.process = childprocess.spawn(nodePath, dropEmpty(args), {
            detached: true,
            cwd: path.dirname(args[1])
          });
          _this.process.stdout.on('data', function(d) {
            return logger.info('child_process', d.toString());
          });
          _this.process.stderr.on('data', function(d) {
            return logger.info('child_process', d.toString());
          });
          _this.process.stdout.on('end', function() {
            return logger.info('child_process', 'end out');
          });
          _this.process.stderr.on('end', function() {
            return logger.info('child_process', 'end error');
          });
          _this.emit('procssCreated', _this.process);
          _this.process.once('error', function(err) {
            switch (err.code) {
              case "ENOENT":
                logger.error('child_process', "ENOENT exit code. Message: " + err.message);
                atom.notifications.addError("Failed to start debugger. Exit code was ENOENT which indicates that the node executable could not be found. Try specifying an explicit path in your atom config file using the node-debugger.nodePath configuration setting.");
                break;
              default:
                logger.error('child_process', "Exit code " + err.code + ". " + err.message);
            }
            return _this.emit('processEnd', err);
          });
          _this.process.once('close', function() {
            logger.info('child_process', 'close');
            return _this.emit('processEnd', _this.process);
          });
          _this.process.once('disconnect', function() {
            logger.info('child_process', 'disconnect');
            return _this.emit('processEnd', _this.process);
          });
          return _this.process;
        };
      })(this));
    };

    ProcessManager.prototype.cleanup = function() {
      var self;
      self = this;
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var onProcessEnd;
          if (_this.process == null) {
            return resolve();
          }
          if (_this.process.exitCode) {
            logger.info('child_process', 'process already exited with code ' + _this.process.exitCode);
            _this.process = null;
            return resolve();
          }
          onProcessEnd = R.once(function() {
            logger.info('child_process', 'die');
            _this.emit('processEnd', _this.process);
            _this.process = null;
            return resolve();
          });
          logger.info('child_process', 'start killing process');
          kill(_this.process.pid);
          _this.process.once('disconnect', onProcessEnd);
          _this.process.once('exit', onProcessEnd);
          return _this.process.once('close', onProcessEnd);
        };
      })(this));
    };

    return ProcessManager;

  })(EventEmitter);

  Debugger = (function(_super) {
    __extends(Debugger, _super);

    function Debugger(atom, processManager) {
      this.atom = atom != null ? atom : atom;
      this.processManager = processManager;
      this.isConnected = __bind(this.isConnected, this);
      this.removeBreakpointMarkers = __bind(this.removeBreakpointMarkers, this);
      this.cleanup = __bind(this.cleanup, this);
      this.bindEvents = __bind(this.bindEvents, this);
      this.start = __bind(this.start, this);
      this.addBreakpoint = __bind(this.addBreakpoint, this);
      this.tryGetBreakpoint = __bind(this.tryGetBreakpoint, this);
      Debugger.__super__.constructor.call(this);
      this.breakpoints = [];
      this.client = null;
      this.onBreakEvent = Event();
      this.onAddBreakpointEvent = Event();
      this.onRemoveBreakpointEvent = Event();
      this.onBreak = this.onBreakEvent.listen;
      this.onAddBreakpoint = this.onAddBreakpointEvent.listen;
      this.onRemoveBreakpoint = this.onRemoveBreakpointEvent.listen;
      this.processManager.on('procssCreated', this.start);
      this.processManager.on('processEnd', this.cleanup);
      this.markers = [];
    }

    Debugger.prototype.stopRetrying = function() {
      if (this.timeout == null) {
        return;
      }
      return clearTimeout(this.timeout);
    };

    Debugger.prototype.listBreakpoints = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.client.listbreakpoints(function(err, res) {
            if (err) {
              return reject(err);
            }
            return resolve(res.breakpoints);
          });
        };
      })(this));
    };

    Debugger.prototype.step = function(type, count) {
      var self;
      self = this;
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.client.step(type, count, function(err) {
            if (err) {
              return reject(err);
            }
            return resolve();
          });
        };
      })(this));
    };

    Debugger.prototype.reqContinue = function() {
      var self;
      self = this;
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.client.req({
            command: 'continue'
          }, function(err) {
            if (err) {
              return reject(err);
            }
            return resolve();
          });
        };
      })(this));
    };

    Debugger.prototype.getScriptById = function(id) {
      var self;
      self = this;
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.client.req({
            command: 'scripts',
            "arguments": {
              ids: [id],
              includeSource: true
            }
          }, function(err, res) {
            if (err) {
              return reject(err);
            }
            return resolve(res[0]);
          });
        };
      })(this));
    };

    Debugger.prototype.tryGetBreakpoint = function(script, line) {
      var findMatch;
      findMatch = R.find((function(_this) {
        return function(breakpoint) {
          if (breakpoint.scriptId === script || breakpoint.scriptReq === script || (breakpoint.script && breakpoint.script.indexOf(script) !== -1)) {
            return breakpoint.line === (line + 1);
          }
        };
      })(this));
      return findMatch(this.client.breakpoints);
    };

    Debugger.prototype.toggleBreakpoint = function(editor, script, line) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var match;
          match = _this.tryGetBreakpoint(script, line);
          if (match) {
            return _this.clearBreakPoint(script, line);
          } else {
            return _this.addBreakpoint(editor, script, line);
          }
        };
      })(this));
    };

    Debugger.prototype.addBreakpoint = function(editor, script, line, condition, silent) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var ambiguous, escapedPath, id, req, scriptId, scriptPathRegex, scripts, _i, _len;
          if (script === void 0) {
            script = _this.client.currentScript;
            line = _this.client.currentSourceLine + 1;
          }
          if (line === void 0 && typeof script === 'number') {
            line = script;
            script = _this.client.currentScript;
          }
          if (script == null) {
            return;
          }
          if (/\(\)$/.test(script)) {
            req = {
              type: 'function',
              target: script.replace(/\(\)$/, ''),
              confition: condition
            };
          } else {
            if (script !== +script && !_this.client.scripts[script]) {
              scripts = _this.client.scripts;
              for (_i = 0, _len = scripts.length; _i < _len; _i++) {
                id = scripts[_i];
                if (scripts[id] && scripts[id].name && scripts.name.indexOf(script) !== -1) {
                  ambiguous = typeof scriptId !== "undefined" && scriptId !== null;
                  scriptId = id;
                } else {
                  scriptId = script;
                }
              }
            }
          }
          if (line <= 0) {
            return reject(new Error('Line should be a positive value'));
          }
          if (ambiguous) {
            return reject(new Error('Invalid script name'));
          }
          if (scriptId != null) {
            req = {
              type: 'scriptId',
              target: scriptId,
              line: line - 1,
              condition: condition
            };
          } else {
            escapedPath = script.replace(/([/\\.?*()^${}|[\]])/g, '\\$1');
            scriptPathRegex = "^(.*[\\/\\\\])?" + escapedPath + "$";
            req = {
              type: 'script',
              target: script,
              line: line,
              condition: condition
            };
          }
          return _this.client.setBreakpoint(req, function(err, res) {
            var brk, _ref, _ref1;
            if (err) {
              return reject(err);
            }
            if (scriptId == null) {
              scriptId = res.script_id;
              line = res.line + 1;
            }
            brk = {
              id: res.breakpoint,
              scriptId: scriptId,
              script: (((_ref = _this.client) != null ? (_ref1 = _ref.scripts) != null ? _ref1[scriptId] : void 0 : void 0) || {}).name,
              line: line,
              condition: condition,
              scriptReq: script
            };
            _this.client.breakpoints.push(brk);
            brk.marker = _this.markLine(editor, brk);
            _this.onAddBreakpointEvent.broadcast(brk);
            return resolve(brk);
          });
        };
      })(this));
    };

    Debugger.prototype.clearBreakPoint = function(script, line) {
      var clearbrk, getbrk, self;
      self = this;
      getbrk = function() {
        return new Promise((function(_this) {
          return function(resolve, reject) {
            var match;
            match = self.tryGetBreakpoint(script, line);
            if (match == null) {
              return reject();
            }
            return resolve({
              breakpoint: match,
              index: self.client.breakpoints.indexOf(match)
            });
          };
        })(this));
      };
      clearbrk = function(brk) {
        return new Promise((function(_this) {
          return function(resolve, reject) {
            return self.client.clearBreakpoint({
              breakpoint: brk.breakpoint.id
            }, function(err) {
              var markerIndex;
              if (err) {
                return reject(err);
              }
              self.client.breakpoints.splice(brk.index, 1);
              markerIndex = self.markers.indexOf(brk.breakpoint.marker);
              self.markers.splice(markerIndex, 1);
              brk.breakpoint.marker.destroy();
              self.onRemoveBreakpointEvent.broadcast(brk);
              return resolve();
            });
          };
        })(this));
      };
      return getbrk().then(clearbrk);
    };

    Debugger.prototype.fullTrace = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.client.fullTrace(function(err, res) {
            if (err) {
              return reject(err);
            }
            return resolve(res);
          });
        };
      })(this));
    };

    Debugger.prototype.start = function() {
      var attemptConnect, attemptConnectCount, onConnectionError, self;
      logger.info('debugger', 'start connect to process');
      self = this;
      attemptConnectCount = 0;
      attemptConnect = function() {
        logger.info('debugger', 'attempt to connect to child process');
        if (self.client == null) {
          logger.info('debugger', 'client has been cleanup');
          return;
        }
        attemptConnectCount++;
        return self.client.connect(self.atom.config.get('node-debugger.debugPort'), self.atom.config.get('node-debugger.debugHost'));
      };
      onConnectionError = (function(_this) {
        return function() {
          logger.info('debugger', "trying to reconnect " + attemptConnectCount);
          attemptConnectCount++;
          _this.emit('reconnect', attemptConnectCount);
          return _this.timeout = setTimeout(function() {
            return attemptConnect();
          }, 500);
        };
      })(this);
      this.client = new Client();
      this.client.once('ready', this.bindEvents);
      this.client.on('unhandledResponse', (function(_this) {
        return function(res) {
          return _this.emit('unhandledResponse', res);
        };
      })(this));
      this.client.on('break', (function(_this) {
        return function(res) {
          _this.onBreakEvent.broadcast(res.body);
          return _this.emit('break', res.body);
        };
      })(this));
      this.client.on('exception', (function(_this) {
        return function(res) {
          return _this.emit('exception', res.body);
        };
      })(this));
      this.client.on('error', onConnectionError);
      this.client.on('close', function() {
        return logger.info('client', 'client closed');
      });
      return attemptConnect();
    };

    Debugger.prototype.bindEvents = function() {
      logger.info('debugger', 'connected');
      this.emit('connected');
      return this.client.on('close', (function(_this) {
        return function() {
          logger.info('debugger', 'connection closed');
          return _this.processManager.cleanup().then(function() {
            return _this.emit('close');
          });
        };
      })(this));
    };

    Debugger.prototype.lookup = function(ref) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.client.reqLookup([ref], function(err, res) {
            if (err) {
              return reject(err);
            }
            return resolve(res[ref]);
          });
        };
      })(this));
    };

    Debugger.prototype["eval"] = function(text) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.client.req({
            command: 'evaluate',
            "arguments": {
              expression: text
            }
          }, function(err, result) {
            if (err) {
              return reject(err);
            }
            return resolve(result);
          });
        };
      })(this));
    };

    Debugger.prototype.cleanup = function() {
      if (this.client == null) {
        return;
      }
      this.removeBreakpointMarkers();
      this.removeDecorations();
      this.client.destroy();
      this.client = null;
      return this.emit('disconnected');
    };

    Debugger.prototype.markLine = function(editor, breakPoint) {
      var marker;
      marker = editor.markBufferPosition([breakPoint.line - 1, 0], {
        invalidate: 'never'
      });
      editor.decorateMarker(marker, {
        type: 'line-number',
        "class": 'node-debugger-breakpoint'
      });
      this.markers.push(marker);
      return marker;
    };

    Debugger.prototype.removeBreakpointMarkers = function() {
      var breakpoint, _i, _len, _ref, _results;
      if (this.client == null) {
        return;
      }
      _ref = this.client.breakpoints;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        breakpoint = _ref[_i];
        _results.push(breakpoint.marker.destroy());
      }
      return _results;
    };

    Debugger.prototype.removeDecorations = function() {
      var marker, _i, _len, _ref;
      if (this.markers == null) {
        return;
      }
      _ref = this.markers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        marker.destroy();
      }
      return this.markers = [];
    };

    Debugger.prototype.isConnected = function() {
      return this.client != null;
    };

    return Debugger;

  })(EventEmitter);

  exports.ProcessManager = ProcessManager;

  exports.Debugger = Debugger;

}).call(this);
