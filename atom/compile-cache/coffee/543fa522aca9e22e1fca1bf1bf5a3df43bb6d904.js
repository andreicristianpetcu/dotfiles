
/*
Borrow from feedback package
 */

(function() {
  var $, NotificationView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), $ = _ref.$, View = _ref.View;

  module.exports = NotificationView = (function(_super) {
    __extends(NotificationView, _super);

    function NotificationView() {
      return NotificationView.__super__.constructor.apply(this, arguments);
    }

    NotificationView.warn = function() {
      return this.li((function(_this) {
        return function() {
          _this.span("'");
          _this.a({
            href: "https://atom.io/packages/js-refactor"
          }, "js-refactor");
          _this.span("' package requires '");
          _this.a({
            href: "https://atom.io/packages/refactor"
          }, "refactor");
          return _this.span("' package");
        };
      })(this));
    };

    NotificationView.content = function() {
      return this.div({
        tabindex: -1,
        "class": 'notification overlay from-top native-key-bindings'
      }, (function(_this) {
        return function() {
          _this.h1("Requires related package installation");
          _this.ul(function() {
            return _this.warn();
          });
          return _this.p("You can install and activate packages using the preference pane.");
        };
      })(this));
    };

    NotificationView.prototype.initialize = function() {
      var $notification, html;
      if (($notification = atom.workspaceView.find('.notification')).length === 0) {
        atom.workspaceView.prepend(this);
      } else {
        html = this.constructor.buildHtml(function() {
          return this.warn();
        });
        $notification.find('ul').append(html);
      }
      this.subscribe(this, 'focusout', (function(_this) {
        return function() {
          return process.nextTick(function() {
            if (!(_this.is(':focus') || _this.find(':focus').length > 0)) {
              return _this.detach();
            }
          });
        };
      })(this));
      this.subscribe(atom.workspaceView, 'core:cancel', (function(_this) {
        return function() {
          return _this.detach();
        };
      })(this));
      return this.focus();
    };

    return NotificationView;

  })(View);

}).call(this);
