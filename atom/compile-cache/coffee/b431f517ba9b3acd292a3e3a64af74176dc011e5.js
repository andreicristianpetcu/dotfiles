(function() {
  var RenameView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  RenameView = (function(_super) {
    __extends(RenameView, _super);

    function RenameView() {
      return RenameView.__super__.constructor.apply(this, arguments);
    }

    RenameView.prototype.createdCallback = function() {
      var buttonClose, buttonRename, container, sub, title, wrapper;
      this.classList.add('atom-ternjs-rename');
      container = document.createElement('div');
      wrapper = document.createElement('div');
      title = document.createElement('h1');
      title.innerHTML = 'Rename';
      sub = document.createElement('h2');
      sub.innerHTML = 'Rename a variable in a scope-aware way. (experimental)';
      buttonClose = document.createElement('button');
      buttonClose.innerHTML = 'Close';
      buttonClose.id = 'close';
      buttonClose.classList.add('btn');
      buttonClose.classList.add('atom-ternjs-rename-close');
      buttonClose.addEventListener('click', (function(_this) {
        return function(e) {
          _this.model.hide();
        };
      })(this));
      this.nameEditor = document.createElement('atom-text-editor');
      this.nameEditor.setAttribute('mini', true);
      this.nameEditor.addEventListener('core:confirm', (function(_this) {
        return function(e) {
          return _this.rename();
        };
      })(this));
      buttonRename = document.createElement('button');
      buttonRename.innerHTML = 'Rename';
      buttonRename.id = 'close';
      buttonRename.classList.add('btn');
      buttonRename.classList.add('mt');
      buttonRename.addEventListener('click', (function(_this) {
        return function(e) {
          return _this.rename();
        };
      })(this));
      wrapper.appendChild(title);
      wrapper.appendChild(sub);
      wrapper.appendChild(this.nameEditor);
      wrapper.appendChild(buttonClose);
      wrapper.appendChild(buttonRename);
      container.appendChild(wrapper);
      return this.appendChild(container);
    };

    RenameView.prototype.initialize = function(model) {
      this.setModel(model);
      return this;
    };

    RenameView.prototype.getModel = function() {
      return this.model;
    };

    RenameView.prototype.setModel = function(model) {
      return this.model = model;
    };

    RenameView.prototype.rename = function() {
      var text;
      text = this.nameEditor.getModel().getBuffer().getText();
      if (!text) {
        return;
      }
      return this.model.updateAllAndRename(text);
    };

    RenameView.prototype.destroy = function() {
      return this.remove();
    };

    return RenameView;

  })(HTMLElement);

  module.exports = document.registerElement('atom-ternjs-rename', {
    prototype: RenameView.prototype
  });

}).call(this);
