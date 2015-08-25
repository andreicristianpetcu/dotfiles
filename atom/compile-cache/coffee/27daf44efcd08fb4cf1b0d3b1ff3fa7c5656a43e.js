(function() {
  var h, hg;

  hg = require('mercury');

  h = hg.h;

  exports.state = function(title) {
    return hg.state({
      title: hg.value(title),
      isOn: hg.value(false),
      channels: {
        toggle: exports.toggle
      }
    });
  };

  exports.toggle = function(state) {
    return state.isOn.set(!state.isOn());
  };

  exports.render = function(state, children) {
    return h('div.debugger-vertical-pane.breakpoint-pane.inset-panel', {}, [
      h('div', {}, [
        h('ul.list-tree.has-collapsable-children', {}, [
          h('li.list-nested-item', {
            className: state.isOn ? '' : 'collapsed'
          }, [
            h('div.list-item.heading', {
              'ev-click': hg.send(state.channels.toggle)
            }, ["" + state.title])
          ].concat(children))
        ])
      ])
    ]);
  };

}).call(this);
