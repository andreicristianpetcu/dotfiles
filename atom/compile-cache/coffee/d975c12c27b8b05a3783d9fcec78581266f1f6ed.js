(function() {
  var BTN_ICON_MAP, h, hg;

  hg = require('mercury');

  h = hg.h;

  BTN_ICON_MAP = {
    'continue': 'icon-playback-play btn btn-primary',
    'next': 'icon-chevron-right btn btn-primary',
    'out': 'icon-chevron-up btn btn-primary',
    'in': 'icon-chevron-down btn btn-primary'
  };

  exports.StepButton = function(_debugger) {
    var StepButton, onNext;
    onNext = function(state) {
      var promise, type;
      type = state.type();
      state.waiting(true);
      promise = null;
      if (type === 'continue') {
        promise = _debugger.reqContinue();
      } else {
        promise = _debugger.step(type, 1);
      }
      return promise.then(function() {
        return state.waiting(false);
      })["catch"](function(e) {
        return state.waiting(false);
      });
    };
    StepButton = function(name, type) {
      return hg.state({
        title: hg.value(name),
        type: hg.value(type),
        waiting: hg.value(false),
        channels: {
          next: onNext
        }
      });
    };
    StepButton.render = function(state) {
      var channels;
      channels = state.channels();
      return h('div', {
        'ev-click': hg.send(channels.next),
        'className': BTN_ICON_MAP[state.type()],
        'distabled': !state.waiting
      }, []);
    };
    return StepButton;
  };

}).call(this);
