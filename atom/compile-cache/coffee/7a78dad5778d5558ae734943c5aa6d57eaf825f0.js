(function() {
  var GoBackView, SymbolsView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SymbolsView = require('./symbols-view');

  module.exports = GoBackView = (function(_super) {
    __extends(GoBackView, _super);

    function GoBackView() {
      return GoBackView.__super__.constructor.apply(this, arguments);
    }

    GoBackView.prototype.toggle = function() {
      var previousTag;
      previousTag = this.stack.pop();
      if (previousTag == null) {
        return;
      }
      return atom.workspace.open(previousTag.file).done((function(_this) {
        return function() {
          if (previousTag.position) {
            return _this.moveToPosition(previousTag.position, false);
          }
        };
      })(this));
    };

    return GoBackView;

  })(SymbolsView);

}).call(this);
