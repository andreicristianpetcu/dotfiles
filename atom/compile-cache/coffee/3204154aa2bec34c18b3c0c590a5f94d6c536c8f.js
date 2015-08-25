(function() {
  var $$, ListView, SelectListView, git, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  git = require('../git');

  module.exports = ListView = (function(_super) {
    __extends(ListView, _super);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.initialize = function() {
      ListView.__super__.initialize.apply(this, arguments);
      this.currentPane = atom.workspace.getActivePane();
      return this.result = new Promise((function(_this) {
        return function(resolve, reject) {
          _this.resolve = resolve;
          _this.reject = reject;
          return _this.setup();
        };
      })(this));
    };

    ListView.prototype.getFilterKey = function() {
      return 'path';
    };

    ListView.prototype.setup = function() {
      this.setItems(atom.project.getPaths().map(function(p) {
        return {
          path: p,
          relativized: p.substring(p.lastIndexOf('/') + 1)
        };
      }));
      return this.show();
    };

    ListView.prototype.show = function() {
      this.filterEditorView.getModel().placeholderText = 'Initialize new repo where?';
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.focusFilterEditor();
      return this.storeFocusedElement();
    };

    ListView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    ListView.prototype.cancelled = function() {
      return this.hide();
    };

    ListView.prototype.viewForItem = function(_arg) {
      var path, relativized;
      path = _arg.path, relativized = _arg.relativized;
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'text-highlight'
            }, relativized);
            return _this.div({
              "class": 'text-info'
            }, path);
          };
        })(this));
      });
    };

    ListView.prototype.confirmed = function(_arg) {
      var path;
      path = _arg.path;
      this.resolve(path);
      return this.cancel();
    };

    return ListView;

  })(SelectListView);

}).call(this);
