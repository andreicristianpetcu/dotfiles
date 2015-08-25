(function() {
  var ReferenceView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ReferenceView = (function(_super) {
    __extends(ReferenceView, _super);

    function ReferenceView() {
      return ReferenceView.__super__.constructor.apply(this, arguments);
    }

    ReferenceView.prototype.createdCallback = function() {
      var container;
      this.classList.add('atom-ternjs-reference');
      container = document.createElement('div');
      this.content = document.createElement('div');
      this.close = document.createElement('button');
      this.close.classList.add('btn', 'atom-ternjs-reference-close');
      this.close.innerHTML = 'Close';
      container.appendChild(this.close);
      container.appendChild(this.content);
      return this.appendChild(container);
    };

    ReferenceView.prototype.initialize = function(model) {
      this.setModel(model);
      return this;
    };

    ReferenceView.prototype.clickHandle = function(i) {
      return this.model.goToReference(i);
    };

    ReferenceView.prototype.buildItems = function(data) {
      var headline, i, item, li, list, _i, _len, _ref;
      this.content.innerHTML = '';
      headline = document.createElement('h2');
      headline.innerHTML = data.name + (" (" + data.type + ")");
      this.content.appendChild(headline);
      list = document.createElement('ul');
      _ref = data.refs;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        item = _ref[i];
        li = document.createElement('li');
        li.innerHTML = "<h3><span><span class=\"darken\">(" + (item.position.row + 1) + ":" + item.position.column + "):</span> <span>" + item.lineText + "</span></span> <span class=\"darken\">(" + item.file + ")</span><div class=\"clear\"></div></h3>";
        li.addEventListener('click', this.clickHandle.bind(this, i), false);
        list.appendChild(li);
      }
      return this.content.appendChild(list);
    };

    ReferenceView.prototype.destroy = function() {
      return this.remove();
    };

    ReferenceView.prototype.getClose = function() {
      return this.close;
    };

    ReferenceView.prototype.getModel = function() {
      return this.model;
    };

    ReferenceView.prototype.setModel = function(model) {
      return this.model = model;
    };

    return ReferenceView;

  })(HTMLElement);

  module.exports = document.registerElement('atom-ternjs-reference', {
    prototype: ReferenceView.prototype
  });

}).call(this);
