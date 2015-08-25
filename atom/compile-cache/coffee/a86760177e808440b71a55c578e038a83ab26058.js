(function() {
  var h, hg;

  hg = require('mercury');

  h = hg.h;

  exports.create = function(_debugger) {
    var cancel;
    cancel = function() {
      return _debugger.processManager.cleanup();
    };
    return hg.state({
      channels: {
        cancel: cancel
      }
    });
  };

  exports.render = function(state) {
    return h('button.btn.btn-error', {
      'ev-click': hg.send(state.channels.cancel)
    }, ['x']);
  };

}).call(this);
