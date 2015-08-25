(function() {
  var BlameErrorView, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  module.exports = BlameErrorView = (function(_super) {
    __extends(BlameErrorView, _super);

    function BlameErrorView() {
      this.onOk = __bind(this.onOk, this);
      return BlameErrorView.__super__.constructor.apply(this, arguments);
    }

    BlameErrorView.content = function(params) {
      return this.div({
        "class": 'overlay from-top'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'block text-highlight'
          }, 'Git Blame Error:');
          _this.div({
            "class": 'error-message block'
          }, params.message);
          return _this.div({
            "class": 'block'
          }, function() {
            return _this.button({
              "class": 'btn',
              click: 'onOk'
            }, 'Ok');
          });
        };
      })(this));
    };

    BlameErrorView.prototype.onOk = function(event, element) {
      return this.remove();
    };

    BlameErrorView.prototype.attach = function() {
      return atom.workspace.addTopPanel({
        item: this
      });
    };

    return BlameErrorView;

  })(View);

}).call(this);
