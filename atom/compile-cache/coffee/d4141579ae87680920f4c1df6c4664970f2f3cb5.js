(function() {
  var $, $$, SelectListMultipleView, SelectListView, View, fuzzyFilter, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fuzzyFilter = require('../models/fuzzy').filter;

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, View = _ref.View, SelectListView = _ref.SelectListView;

  module.exports = SelectListMultipleView = (function(_super) {
    var selectedItems;

    __extends(SelectListMultipleView, _super);

    function SelectListMultipleView() {
      return SelectListMultipleView.__super__.constructor.apply(this, arguments);
    }

    selectedItems = [];

    SelectListMultipleView.prototype.initialize = function() {
      SelectListMultipleView.__super__.initialize.apply(this, arguments);
      selectedItems = [];
      this.list.addClass('mark-active');
      this.on('mousedown', (function(_this) {
        return function(_arg) {
          var target;
          target = _arg.target;
          if (target === _this.list[0] || $(target).hasClass('btn')) {
            return false;
          }
        };
      })(this));
      this.on('keypress', (function(_this) {
        return function(_arg) {
          var keyCode;
          keyCode = _arg.keyCode;
          if (keyCode === 13) {
            return _this.complete();
          }
        };
      })(this));
      return this.addButtons();
    };

    SelectListMultipleView.prototype.addButtons = function() {
      var viewButton;
      viewButton = $$(function() {
        return this.div({
          "class": 'buttons'
        }, (function(_this) {
          return function() {
            _this.span({
              "class": 'pull-left'
            }, function() {
              return _this.button({
                "class": 'btn btn-error inline-block-tight btn-cancel-button'
              }, 'Cancel');
            });
            return _this.span({
              "class": 'pull-right'
            }, function() {
              return _this.button({
                "class": 'btn btn-success inline-block-tight btn-complete-button'
              }, 'Confirm');
            });
          };
        })(this));
      });
      viewButton.appendTo(this);
      return this.on('click', 'button', (function(_this) {
        return function(_arg) {
          var target;
          target = _arg.target;
          if ($(target).hasClass('btn-complete-button')) {
            _this.complete();
          }
          if ($(target).hasClass('btn-cancel-button')) {
            return _this.cancel();
          }
        };
      })(this));
    };

    SelectListMultipleView.prototype.confirmSelection = function() {
      var item, viewItem;
      item = this.getSelectedItem();
      viewItem = this.getSelectedItemView();
      if (viewItem != null) {
        return this.confirmed(item, viewItem);
      } else {
        return this.cancel();
      }
    };

    SelectListMultipleView.prototype.confirmed = function(item, viewItem) {
      if (__indexOf.call(selectedItems, item) >= 0) {
        selectedItems = selectedItems.filter(function(i) {
          return i !== item;
        });
        return viewItem.removeClass('active');
      } else {
        selectedItems.push(item);
        return viewItem.addClass('active');
      }
    };

    SelectListMultipleView.prototype.complete = function() {
      if (selectedItems.length > 0) {
        return this.completed(selectedItems);
      } else {
        return this.cancel();
      }
    };

    SelectListMultipleView.prototype.populateList = function() {
      var filterQuery, filteredItems, i, item, itemView, options, _i, _ref1, _ref2, _ref3;
      if (this.items == null) {
        return;
      }
      filterQuery = this.getFilterQuery();
      if (filterQuery.length) {
        options = {
          pre: '<span class="text-warning" style="font-weight:bold">',
          post: "</span>",
          extract: (function(_this) {
            return function(el) {
              if (_this.getFilterKey() != null) {
                return el[_this.getFilterKey()];
              } else {
                return el;
              }
            };
          })(this)
        };
        filteredItems = fuzzyFilter(filterQuery, this.items, options);
      } else {
        filteredItems = this.items;
      }
      this.list.empty();
      if (filteredItems.length) {
        this.setError(null);
        for (i = _i = 0, _ref1 = Math.min(filteredItems.length, this.maxItems); 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
          item = (_ref2 = filteredItems[i].original) != null ? _ref2 : filteredItems[i];
          itemView = $(this.viewForItem(item, (_ref3 = filteredItems[i].string) != null ? _ref3 : null));
          itemView.data('select-list-item', item);
          if (__indexOf.call(selectedItems, item) >= 0) {
            itemView.addClass('active');
          }
          this.list.append(itemView);
        }
        return this.selectItemView(this.list.find('li:first'));
      } else {
        return this.setError(this.getEmptyMessage(this.items.length, filteredItems.length));
      }
    };

    SelectListMultipleView.prototype.viewForItem = function(item, matchedStr) {
      throw new Error("Subclass must implement a viewForItem(item) method");
    };

    SelectListMultipleView.prototype.completed = function(items) {
      throw new Error("Subclass must implement a completed(items) method");
    };

    return SelectListMultipleView;

  })(SelectListView);

}).call(this);
