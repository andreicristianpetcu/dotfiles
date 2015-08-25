(function() {
  var EventEmitter2, ModuleManager, config, isFunction, packageManager, satisfies, workspace,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  satisfies = require('semver').satisfies;

  EventEmitter2 = require('eventemitter2').EventEmitter2;

  workspace = atom.workspace, config = atom.config, packageManager = atom.packages;

  isFunction = function(func) {
    return (typeof func) === 'function';
  };

  module.exports = ModuleManager = (function(_super) {
    __extends(ModuleManager, _super);

    ModuleManager.prototype.modules = {};

    ModuleManager.prototype.version = '0.0.0';

    function ModuleManager() {
      this.update = __bind(this.update, this);
      ModuleManager.__super__.constructor.apply(this, arguments);
      this.setMaxListeners(0);
      this.update();
    }

    ModuleManager.prototype.destruct = function() {
      return delete this.modules;
    };

    ModuleManager.prototype.update = function() {
      var engines, metaData, name, requiredVersion, _i, _len, _ref, _results;
      this.modules = {};
      _ref = packageManager.getAvailablePackageMetadata();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        metaData = _ref[_i];
        name = metaData.name, engines = metaData.engines;
        if (!(!packageManager.isPackageDisabled(name) && ((requiredVersion = engines != null ? engines.refactor : void 0) != null) && satisfies(this.version, requiredVersion))) {
          continue;
        }
        _results.push(this.activate(name));
      }
      return _results;
    };

    ModuleManager.prototype.activate = function(name) {
      return packageManager.activatePackage(name).then((function(_this) {
        return function(pkg) {
          var Ripper, module, scopeName, _i, _len, _ref;
          Ripper = (module = pkg.mainModule).Ripper;
          if (!((Ripper != null) && Array.isArray(Ripper.scopeNames) && isFunction(Ripper.prototype.parse) && isFunction(Ripper.prototype.find))) {
            console.error("'" + name + "' should implement Ripper.scopeNames, Ripper.parse() and Ripper.find()");
            return;
          }
          _ref = Ripper.scopeNames;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            scopeName = _ref[_i];
            _this.modules[scopeName] = module;
          }
          return _this.emit('changed');
        };
      })(this));
    };

    ModuleManager.prototype.getModule = function(sourceName) {
      return this.modules[sourceName];
    };

    return ModuleManager;

  })(EventEmitter2);

}).call(this);
