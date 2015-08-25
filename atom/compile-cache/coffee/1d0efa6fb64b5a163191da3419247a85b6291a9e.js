(function() {
  var BranchListView, RemoteBranchListView, git,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  git = require('../git');

  BranchListView = require('../views/branch-list-view');

  module.exports = RemoteBranchListView = (function(_super) {
    __extends(RemoteBranchListView, _super);

    function RemoteBranchListView() {
      return RemoteBranchListView.__super__.constructor.apply(this, arguments);
    }

    RemoteBranchListView.prototype.args = ['checkout', '-t'];

    return RemoteBranchListView;

  })(BranchListView);

}).call(this);
