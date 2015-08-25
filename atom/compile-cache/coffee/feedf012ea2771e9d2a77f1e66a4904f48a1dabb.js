(function() {
  var CompositeDisposable, Debugger, Event, NodeDebuggerView, ProcessManager, initNotifications, jumpToBreakpoint, logger, onBreak, os, processManager, _debugger, _ref;

  NodeDebuggerView = require('./node-debugger-view');

  Event = require('geval');

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('./debugger'), Debugger = _ref.Debugger, ProcessManager = _ref.ProcessManager;

  jumpToBreakpoint = require('./jump-to-breakpoint');

  logger = require('./logger');

  os = require('os');

  processManager = null;

  _debugger = null;

  onBreak = null;

  initNotifications = function(_debugger) {
    _debugger.on('connected', function() {
      return atom.notifications.addSuccess('connected, enjoy debugging : )');
    });
    return _debugger.on('disconnected', function() {
      return atom.notifications.addInfo('finish debugging : )');
    });
  };

  module.exports = {
    nodeDebuggerView: null,
    config: {
      nodePath: {
        type: 'string',
        "default": os.platform() === 'win32' ? 'node.exe' : '/bin/node'
      },
      debugPort: {
        type: 'number',
        minium: 5857,
        maxium: 65535,
        "default": 5858
      },
      debugHost: {
        type: 'string',
        "default": '127.0.0.1'
      },
      nodeArgs: {
        type: 'string',
        "default": ''
      },
      appArgs: {
        type: 'string',
        "default": ''
      },
      isCoffeeScript: {
        type: 'boolean',
        "default": false
      }
    },
    activate: function() {
      this.disposables = new CompositeDisposable();
      processManager = new ProcessManager(atom);
      _debugger = new Debugger(atom, processManager);
      initNotifications(_debugger);
      this.disposables.add(atom.commands.add('atom-workspace', {
        'node-debugger:start-resume': this.startOrResume,
        'node-debugger:stop': this.stop,
        'node-debugger:toggle-breakpoint': this.toggleBreakpoint,
        'node-debugger:step-next': this.stepNext,
        'node-debugger:step-in': this.stepIn,
        'node-debugger:step-out': this.stepOut
      }));
      return jumpToBreakpoint(_debugger);
    },
    startOrResume: (function(_this) {
      return function() {
        if (_debugger.isConnected()) {
          return _debugger.reqContinue();
        } else {
          processManager.start();
          return NodeDebuggerView.show(_debugger);
        }
      };
    })(this),
    toggleBreakpoint: (function(_this) {
      return function() {
        var editor, path, row;
        editor = atom.workspace.getActiveTextEditor();
        path = editor.getPath();
        row = editor.getCursorBufferPosition().row;
        return _debugger.toggleBreakpoint(editor, path, row);
      };
    })(this),
    stepNext: (function(_this) {
      return function() {
        return _debugger.step('next', 1);
      };
    })(this),
    stepIn: (function(_this) {
      return function() {
        return _debugger.step('in', 1);
      };
    })(this),
    stepOut: (function(_this) {
      return function() {
        return _debugger.step('out', 1);
      };
    })(this),
    stop: (function(_this) {
      return function() {
        processManager.cleanup();
        _debugger.cleanup();
        NodeDebuggerView.destroy();
        return jumpToBreakpoint.cleanup();
      };
    })(this),
    deactivate: function() {
      logger.info('deactive', 'stop running plugin');
      jumpToBreakpoint.destroy();
      this.stop();
      this.disposables.dispose();
      return NodeDebuggerView.destroy();
    },
    serialize: function() {
      return {
        nodeDebuggerViewState: this.nodeDebuggerView.serialize()
      };
    }
  };

}).call(this);
