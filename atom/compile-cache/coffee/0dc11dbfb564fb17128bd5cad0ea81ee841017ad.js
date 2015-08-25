(function() {
  var $$, BufferedProcess, SelectListView, TagCreateView, TagListView, TagView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BufferedProcess = require('atom').BufferedProcess;

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  TagView = require('./tag-view');

  TagCreateView = require('./tag-create-view');

  module.exports = TagListView = (function(_super) {
    __extends(TagListView, _super);

    function TagListView() {
      return TagListView.__super__.constructor.apply(this, arguments);
    }

    TagListView.prototype.initialize = function(repo, data) {
      this.repo = repo;
      this.data = data != null ? data : '';
      TagListView.__super__.initialize.apply(this, arguments);
      this.show();
      return this.parseData();
    };

    TagListView.prototype.parseData = function() {
      var item, items, tmp;
      if (this.data.length > 0) {
        this.data = this.data.split("\n").slice(0, -1);
        items = (function() {
          var _i, _len, _ref1, _results;
          _ref1 = this.data.reverse();
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            item = _ref1[_i];
            if (!(item !== '')) {
              continue;
            }
            tmp = item.match(/([\w\d-_/.]+)\s(.*)/);
            _results.push({
              tag: tmp != null ? tmp[1] : void 0,
              annotation: tmp != null ? tmp[2] : void 0
            });
          }
          return _results;
        }).call(this);
      } else {
        items = [];
      }
      items.push({
        tag: '+ Add Tag',
        annotation: 'Add a tag referencing the current commit.'
      });
      this.setItems(items);
      return this.focusFilterEditor();
    };

    TagListView.prototype.getFilterKey = function() {
      return 'tag';
    };

    TagListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    TagListView.prototype.cancelled = function() {
      return this.hide();
    };

    TagListView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    TagListView.prototype.viewForItem = function(_arg) {
      var annotation, tag;
      tag = _arg.tag, annotation = _arg.annotation;
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'text-highlight'
            }, tag);
            return _this.div({
              "class": 'text-warning'
            }, annotation);
          };
        })(this));
      });
    };

    TagListView.prototype.confirmed = function(_arg) {
      var tag;
      tag = _arg.tag;
      this.cancel();
      if (tag === '+ Add Tag') {
        return new TagCreateView(this.repo);
      } else {
        return new TagView(this.repo, tag);
      }
    };

    return TagListView;

  })(SelectListView);

}).call(this);
