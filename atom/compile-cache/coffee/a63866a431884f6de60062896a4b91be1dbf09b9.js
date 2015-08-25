(function() {
  var $$, RepoListView, SelectListView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  module.exports = RepoListView = (function(_super) {
    __extends(RepoListView, _super);

    function RepoListView() {
      return RepoListView.__super__.constructor.apply(this, arguments);
    }

    RepoListView.prototype.initialize = function(listOfItems) {
      this.listOfItems = listOfItems;
      RepoListView.__super__.initialize.apply(this, arguments);
      this.addClass('modal overlay from-top');
      this.storeFocusedElement();
      this.panel = atom.workspace.addModalPanel({
        item: this,
        visible: true
      });
      this.panel.show();
      this.setItems(this.listOfItems);
      return this.focusFilterEditor();
    };

    RepoListView.prototype.getFilterKey = function() {
      return 'repo_name';
    };

    RepoListView.prototype.viewForItem = function(item) {
      return $$(function() {
        return this.li(item.repo_name);
      });
    };

    RepoListView.prototype.cancelled = function() {
      this.panel.hide();
      return this.panel.destroy();
    };

    RepoListView.prototype.confirmed = function(item) {
      var old_pane, options, uri;
      this.cancel();
      options = {
        'repo': item
      };
      uri = "git-log://" + item.repo_name;
      old_pane = atom.workspace.paneForURI(uri);
      if (old_pane) {
        old_pane.destroyItem(old_pane.itemForURI(uri));
      }
      return atom.workspace.open(uri, options);
    };

    return RepoListView;

  })(SelectListView);

}).call(this);
