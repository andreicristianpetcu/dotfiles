(function() {
  var $, OutputView, ScrollView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, ScrollView = _ref.ScrollView;

  module.exports = OutputView = (function(_super) {
    __extends(OutputView, _super);

    function OutputView() {
      return OutputView.__super__.constructor.apply(this, arguments);
    }

    OutputView.prototype.message = '';

    OutputView.content = function() {
      return this.div({
        "class": 'git-plus info-view'
      }, (function(_this) {
        return function() {
          return _this.pre({
            "class": 'output'
          });
        };
      })(this));
    };

    OutputView.prototype.initialize = function() {
      return OutputView.__super__.initialize.apply(this, arguments);
    };

    OutputView.prototype.addLine = function(line) {
      return this.message += line;
    };

    OutputView.prototype.reset = function() {
      return this.message = '';
    };

    OutputView.prototype.finish = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addBottomPanel({
          item: this
        });
      }
      this.find(".output").append(this.message);
      return setTimeout((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this), atom.config.get('git-plus.messageTimeout') * 1000);
    };

    OutputView.prototype.destroy = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    return OutputView;

  })(ScrollView);

}).call(this);
