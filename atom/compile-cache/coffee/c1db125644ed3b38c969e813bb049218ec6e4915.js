(function() {
  var ConfigView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ConfigView = (function(_super) {
    __extends(ConfigView, _super);

    function ConfigView() {
      return ConfigView.__super__.constructor.apply(this, arguments);
    }

    ConfigView.prototype.createdCallback = function() {
      var container;
      this.classList.add('atom-ternjs-config');
      container = document.createElement('div');
      this.content = document.createElement('div');
      this.content.classList.add('content');
      this.close = document.createElement('button');
      this.close.classList.add('btn', 'atom-ternjs-config-close');
      this.close.innerHTML = 'Save & Restart Server';
      this.cancel = document.createElement('button');
      this.cancel.classList.add('btn', 'atom-ternjs-config-close');
      this.cancel.innerHTML = 'Cancel';
      container.appendChild(this.content);
      return this.appendChild(container);
    };

    ConfigView.prototype.initialize = function(model) {
      this.setModel(model);
      return this;
    };

    ConfigView.prototype.buildOptionsMarkup = function(manager) {
      var config, header, project, text, title, wrapper, _ref;
      project = (_ref = manager.client) != null ? _ref.rootPath : void 0;
      config = this.getModel().config;
      title = document.createElement('h2');
      title.innerHTML = project;
      this.content.appendChild(title);
      this.content.appendChild(this.buildBoolean('libs'));
      this.content.appendChild(this.buildStringArray(config.loadEagerly, 'loadEagerly'));
      this.content.appendChild(this.buildStringArray(config.dontLoad, 'dontLoad'));
      wrapper = document.createElement('section');
      header = document.createElement('h2');
      header.innerHTML = 'plugins';
      text = document.createElement('p');
      text.innerHTML = 'This section isn\'t implemented yet.<br />Please add plugins manually by editing your .tern-project file located in your root-path.';
      wrapper.appendChild(header);
      wrapper.appendChild(text);
      this.content.appendChild(wrapper);
      this.content.appendChild(this.close);
      this.content.appendChild(this.cancel);
      return true;
    };

    ConfigView.prototype.buildStringArray = function(obj, section) {
      var doc, header, path, wrapper, _i, _len;
      wrapper = document.createElement('section');
      wrapper.dataset.type = section;
      header = document.createElement('h2');
      header.innerHTML = section;
      doc = document.createElement('p');
      doc.innerHTML = this.getModel().config.docs[section].doc;
      wrapper.appendChild(header);
      wrapper.appendChild(doc);
      for (_i = 0, _len = obj.length; _i < _len; _i++) {
        path = obj[_i];
        wrapper.appendChild(this.createInputWrapper(path, section));
      }
      if (obj.length === 0) {
        wrapper.appendChild(this.createInputWrapper(null, section));
      }
      return wrapper;
    };

    ConfigView.prototype.createInputWrapper = function(path, section) {
      var editor, inputWrapper;
      inputWrapper = document.createElement('div');
      inputWrapper.classList.add('input-wrapper');
      editor = this.createTextEditor(path);
      editor.__ternjs_section = section;
      inputWrapper.appendChild(editor);
      inputWrapper.appendChild(this.createAdd(section));
      inputWrapper.appendChild(this.createSub(editor));
      return inputWrapper;
    };

    ConfigView.prototype.createSub = function(editor) {
      var sub;
      sub = document.createElement('span');
      sub.classList.add('sub');
      sub.classList.add('inline-block');
      sub.classList.add('status-removed');
      sub.classList.add('icon');
      sub.classList.add('icon-diff-removed');
      sub.addEventListener('click', (function(_this) {
        return function(e) {
          var inputWrapper;
          _this.getModel().removeEditor(editor);
          inputWrapper = e.target.closest('.input-wrapper');
          return inputWrapper.parentNode.removeChild(inputWrapper);
        };
      })(this), false);
      return sub;
    };

    ConfigView.prototype.createAdd = function(section) {
      var add;
      add = document.createElement('span');
      add.classList.add('add');
      add.classList.add('inline-block');
      add.classList.add('status-added');
      add.classList.add('icon');
      add.classList.add('icon-diff-added');
      add.addEventListener('click', (function(_this) {
        return function(e) {
          return e.target.closest('section').appendChild(_this.createInputWrapper(null, section));
        };
      })(this), false);
      return add;
    };

    ConfigView.prototype.createTextEditor = function(path) {
      var item;
      item = document.createElement('atom-text-editor');
      item.setAttribute('mini', true);
      if (path) {
        item.getModel().getBuffer().setText(path);
      }
      this.getModel().editors.push(item);
      return item;
    };

    ConfigView.prototype.buildBoolean = function(section) {
      var checkbox, header, inputWrapper, key, label, wrapper, _i, _len, _ref;
      wrapper = document.createElement('section');
      wrapper.classList.add(section);
      header = document.createElement('h2');
      header.innerHTML = section;
      wrapper.appendChild(header);
      _ref = Object.keys(this.getModel().config.libs);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        inputWrapper = document.createElement('div');
        inputWrapper.classList.add('input-wrapper');
        label = document.createElement('span');
        label.innerHTML = key;
        checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = this.getModel().config.libs[key];
        checkbox.__ternjs_key = key;
        checkbox.addEventListener('change', (function(_this) {
          return function(e) {
            return _this.getModel().config.libs[e.target.__ternjs_key] = e.target.checked;
          };
        })(this), false);
        inputWrapper.appendChild(label);
        inputWrapper.appendChild(checkbox);
        wrapper.appendChild(inputWrapper);
      }
      return wrapper;
    };

    ConfigView.prototype.removeContent = function() {
      var _ref;
      return (_ref = this.content) != null ? _ref.innerHTML = '' : void 0;
    };

    ConfigView.prototype.getClose = function() {
      return this.close;
    };

    ConfigView.prototype.getCancel = function() {
      return this.cancel;
    };

    ConfigView.prototype.destroy = function() {
      return this.remove();
    };

    ConfigView.prototype.getModel = function() {
      return this.model;
    };

    ConfigView.prototype.setModel = function(model) {
      return this.model = model;
    };

    return ConfigView;

  })(HTMLElement);

  module.exports = document.registerElement('atom-ternjs-config', {
    prototype: ConfigView.prototype
  });

}).call(this);
