(function() {
  module.exports = {
    title: 'Git-Plus',
    addInfo: function(message, _arg) {
      var dismissable;
      dismissable = (_arg != null ? _arg : {}).dismissable;
      return atom.notifications.addInfo(this.title, {
        detail: message,
        dismissable: dismissable
      });
    },
    addSuccess: function(message, _arg) {
      var dismissable;
      dismissable = (_arg != null ? _arg : {}).dismissable;
      return atom.notifications.addSuccess(this.title, {
        detail: message,
        dismissable: dismissable
      });
    },
    addError: function(message, _arg) {
      var dismissable;
      dismissable = (_arg != null ? _arg : {}).dismissable;
      return atom.notifications.addError(this.title, {
        detail: message,
        dismissable: dismissable
      });
    }
  };

}).call(this);
