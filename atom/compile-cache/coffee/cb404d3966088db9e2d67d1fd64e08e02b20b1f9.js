(function() {
  var Main, ModuleManager, Watcher, packageManager,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Watcher = require('./watcher');

  ModuleManager = require('./module_manager');

  packageManager = atom.packages;

  module.exports = new (Main = (function() {
    function Main() {
      this.onDone = __bind(this.onDone, this);
      this.onRename = __bind(this.onRename, this);
      this.onDestroyed = __bind(this.onDestroyed, this);
      this.onCreated = __bind(this.onCreated, this);
    }

    Main.prototype.renameCommand = 'refactor:rename';

    Main.prototype.doneCommand = 'refactor:done';

    Main.prototype.configDefaults = {
      highlightError: true,
      highlightReference: true
    };


    /*
    Life cycle
     */

    Main.prototype.activate = function(state) {
      this.moduleManager = new ModuleManager;
      this.watchers = [];
      atom.workspace.observeTextEditors(this.onCreated);
      atom.commands.add('atom-text-editor', this.renameCommand, this.onRename);
      return atom.commands.add('atom-text-editor', this.doneCommand, this.onDone);
    };

    Main.prototype.deactivate = function() {
      var watcher, _i, _len, _ref;
      this.moduleManager.destruct();
      delete this.moduleManager;
      _ref = this.watchers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        watcher = _ref[_i];
        watcher.destruct();
      }
      delete this.watchers;
      atom.workspaceView.off(this.renameCommand, this.onRename);
      return atom.workspaceView.off(this.doneCommand, this.onDone);
    };

    Main.prototype.serialize = function() {};


    /*
    Events
     */

    Main.prototype.onCreated = function(editor) {
      var watcher;
      watcher = new Watcher(this.moduleManager, editor);
      watcher.on('destroyed', this.onDestroyed);
      return this.watchers.push(watcher);
    };

    Main.prototype.onDestroyed = function(watcher) {
      watcher.destruct();
      return this.watchers.splice(this.watchers.indexOf(watcher), 1);
    };

    Main.prototype.onRename = function(e) {
      var isExecuted, watcher, _i, _len, _ref;
      isExecuted = false;
      _ref = this.watchers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        watcher = _ref[_i];
        isExecuted || (isExecuted = watcher.rename());
      }
      if (isExecuted) {
        return;
      }
      return e.abortKeyBinding();
    };

    Main.prototype.onDone = function(e) {
      var isExecuted, watcher, _i, _len, _ref;
      isExecuted = false;
      _ref = this.watchers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        watcher = _ref[_i];
        isExecuted || (isExecuted = watcher.done());
      }
      if (isExecuted) {
        return;
      }
      return e.abortKeyBinding();
    };

    return Main;

  })());

}).call(this);
