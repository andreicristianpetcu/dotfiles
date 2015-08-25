(function() {
  var Config, ConfigView, _;

  ConfigView = require('./atom-ternjs-config-view');

  _ = require('underscore-plus');

  module.exports = Config = (function() {
    Config.prototype.configView = null;

    Config.prototype.config = null;

    Config.prototype.projectConfig = null;

    Config.prototype.editors = [];

    Config.prototype.manager = null;

    function Config(manager, state) {
      if (state == null) {
        state = {};
      }
      this.manager = manager;
      this.configView = new ConfigView();
      this.configView.initialize(this);
      this.configPanel = atom.workspace.addRightPanel({
        item: this.configView,
        priority: 0
      });
      this.configPanel.hide();
      atom.views.getView(this.configPanel).classList.add('atom-ternjs-config-panel');
      this.registerEvents();
    }

    Config.prototype.getContent = function(filePath, projectRoot) {
      var content;
      content = this.manager.helper.getFileContent(filePath, projectRoot);
      if (!content) {
        return;
      }
      content = JSON.parse(content);
      if (!content) {
        return;
      }
      return content;
    };

    Config.prototype.prepareLibs = function(localConfig, configStub) {
      var lib, libs, libsAsObject, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      libs = {};
      if (!localConfig.libs) {
        localConfig.libs = {};
      } else {
        libsAsObject = {};
        _ref = localConfig.libs;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          lib = _ref[_i];
          libsAsObject[lib] = true;
        }
        localConfig.libs = libsAsObject;
      }
      _ref1 = Object.keys(configStub.libs);
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        lib = _ref1[_j];
        if (!localConfig.libs[lib]) {
          libs[lib] = false;
        } else {
          libs[lib] = true;
        }
      }
      _ref2 = Object.keys(localConfig.libs);
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        lib = _ref2[_k];
        if (!libs[lib]) {
          libs[lib] = true;
        }
      }
      localConfig.libs = libs;
      return localConfig;
    };

    Config.prototype.registerEvents = function() {
      var cancel, close;
      close = this.configView.getClose();
      close.addEventListener('click', (function(_this) {
        return function(e) {
          _this.updateConfig();
          _this.hide();
          return _this.manager.helper.focusEditor();
        };
      })(this));
      cancel = this.configView.getCancel();
      return cancel.addEventListener('click', (function(_this) {
        return function(e) {
          _this.destroyEditors();
          _this.hide();
          return _this.manager.helper.focusEditor();
        };
      })(this));
    };

    Config.prototype.mergeConfigObjects = function(obj1, obj2) {
      return _.deepExtend({}, obj1, obj2);
    };

    Config.prototype.hide = function() {
      var _ref;
      return (_ref = this.configPanel) != null ? _ref.hide() : void 0;
    };

    Config.prototype.clear = function() {
      var _ref;
      this.hide();
      this.destroyEditors();
      this.config = null;
      this.projectConfig = null;
      return (_ref = this.configView) != null ? _ref.removeContent() : void 0;
    };

    Config.prototype.gatherData = function() {
      var configStub, plugin, _ref;
      configStub = this.getContent('../tern-config.json', false);
      if (!configStub) {
        return;
      }
      this.projectConfig = this.getContent('/.tern-project', true);
      this.config = {};
      this.config = this.mergeConfigObjects(this.projectConfig, this.config);
      if (this.projectConfig) {
        this.config = this.prepareLibs(this.config, configStub);
        for (plugin in this.config.plugins) {
          if ((_ref = this.config.plugins[plugin]) != null) {
            _ref.active = true;
          }
        }
        this.config = this.mergeConfigObjects(configStub, this.config);
      } else {
        this.config = configStub;
      }
      return this.configView.buildOptionsMarkup(this.manager);
    };

    Config.prototype.removeEditor = function(editor) {
      var idx;
      if (!editor) {
        return;
      }
      idx = this.editors.indexOf(editor);
      if (idx === -1) {
        return;
      }
      return this.editors.splice(idx, 1);
    };

    Config.prototype.destroyEditors = function() {
      var buffer, editor, _i, _len, _ref;
      _ref = this.editors;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        editor = _ref[_i];
        buffer = editor.getModel().getBuffer();
        buffer.destroy();
      }
      return this.editors = [];
    };

    Config.prototype.updateConfig = function() {
      var buffer, editor, newConfig, newConfigJSON, text, _i, _len, _ref;
      this.config.loadEagerly = [];
      this.config.dontLoad = [];
      _ref = this.editors;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        editor = _ref[_i];
        buffer = editor.getModel().getBuffer();
        text = buffer.getText();
        text = text.trim();
        if (text === '') {
          continue;
        }
        this.config[editor.__ternjs_section].push(text);
      }
      this.destroyEditors();
      newConfig = this.buildNewConfig();
      newConfigJSON = JSON.stringify(newConfig, null, 2);
      this.manager.helper.updateTernFile(newConfigJSON);
      return this.manager.restartServer();
    };

    Config.prototype.buildNewConfig = function() {
      var key, newConfig, _i, _len, _ref;
      newConfig = {};
      if (!_.isEmpty(this.config.libs)) {
        newConfig.libs = [];
        _ref = Object.keys(this.config.libs);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          if (this.config.libs[key]) {
            newConfig.libs.push(key);
          }
        }
      }
      if (this.config.loadEagerly.length !== 0) {
        newConfig.loadEagerly = this.config.loadEagerly;
      }
      if (this.config.dontLoad.length !== 0) {
        newConfig.dontLoad = this.config.dontLoad;
      }
      if (this.projectConfig && !_.isEmpty(this.projectConfig.plugins)) {
        newConfig.plugins = this.projectConfig.plugins;
      }
      return newConfig;
    };

    Config.prototype.show = function() {
      this.clear();
      if (!this.gatherData()) {
        atom.notifications.addInfo('There is no active project. Please re-open or focus at least one JavaScript file of the project to configure.', {
          dismissable: true
        });
        return;
      }
      return this.configPanel.show();
    };

    Config.prototype.destroy = function() {
      var _ref, _ref1;
      if ((_ref = this.configView) != null) {
        _ref.destroy();
      }
      this.configView = null;
      if ((_ref1 = this.configPanel) != null) {
        _ref1.destroy();
      }
      return this.configPanel = null;
    };

    return Config;

  })();

}).call(this);
