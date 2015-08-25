(function() {
  var $, extend, handleDrag, hg;

  hg = require('mercury');

  extend = require('xtend');

  $ = require('atom-space-pen-views').$;

  handleDrag = function(ev, broadcast) {
    var data, delegator, onmove, onup;
    data = this.data;
    delegator = hg.Delegator();
    onmove = function(ev) {
      var delta, docHeight, docWidth, pageX, pageY;
      docHeight = $(document).height();
      docWidth = $(document).width();
      pageY = ev.pageY, pageX = ev.pageX;
      delta = {
        height: docHeight - pageY,
        sideWidth: docWidth - pageX
      };
      return broadcast(extend(data, delta));
    };
    onup = function(ev) {
      delegator.unlistenTo('mousemove');
      delegator.removeGlobalEventListener('mousemove', onmove);
      return delegator.removeGlobalEventListener('mouseup', onup);
    };
    delegator.listenTo('mousemove');
    delegator.addGlobalEventListener('mousemove', onmove);
    return delegator.addGlobalEventListener('mouseup', onup);
  };

  module.exports = hg.BaseEvent(handleDrag);

}).call(this);
