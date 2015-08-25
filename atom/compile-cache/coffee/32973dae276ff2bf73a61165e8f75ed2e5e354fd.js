(function() {
  var TypeView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TypeView = (function(_super) {
    __extends(TypeView, _super);

    function TypeView() {
      return TypeView.__super__.constructor.apply(this, arguments);
    }

    TypeView.prototype.createdCallback = function() {
      this.getModel();
      this.addEventListener('click', (function(_this) {
        return function() {
          return _this.getModel().destroyOverlay();
        };
      })(this), false);
      this.classList.add('atom-ternjs-type');
      this.container = document.createElement('span');
      return this.appendChild(this.container);
    };

    TypeView.prototype.initialize = function(model) {
      this.setModel(model);
      return this;
    };

    TypeView.prototype.getModel = function() {
      return this.model;
    };

    TypeView.prototype.setModel = function(model) {
      return this.model = model;
    };

    TypeView.prototype.setData = function(data) {
      return this.container.innerHTML = data.label;
    };

    TypeView.prototype.destroy = function() {
      return this.remove();
    };

    return TypeView;

  })(HTMLElement);

  module.exports = document.registerElement('atom-ternjs-type', {
    prototype: TypeView.prototype
  });

}).call(this);
