(function() {
  var Promise, ToggleTree, h, hg;

  hg = require('mercury');

  Promise = require('bluebird');

  h = hg.h;

  ToggleTree = require('./ToggleTree');

  exports.create = function(_debugger) {
    var BreakpointPanel, goBreakpoint;
    BreakpointPanel = function() {
      var refresh, state;
      state = hg.state({
        rootToggle: ToggleTree.state('Breakpoints'),
        breakpoints: hg.value([])
      });
      refresh = function() {
        return _debugger.listBreakpoints().then(function(brks) {
          return Promise.map(brks, function(brk) {
            if (brk.script_id != null) {
              return _debugger.getScriptById(brk.script_id).then(function(script) {
                brk.script = script;
                return brk;
              });
            } else if (brk.script_name) {
              brk.script = {
                name: brk.script_name
              };
            }
            return brk;
          }).then(function(brks) {
            return state.breakpoints.set(brks);
          });
        });
      };
      _debugger.onAddBreakpoint(refresh);
      _debugger.onRemoveBreakpoint(refresh);
      _debugger.onBreak(refresh);
      return state;
    };
    BreakpointPanel.cleanup = function() {
      if (typeof removeListener !== "undefined" && removeListener !== null) {
        return removeListener();
      }
    };
    goBreakpoint = function(brk) {
      return function() {
        var line, name;
        line = brk.line;
        name = brk.script.name;
        return atom.workspace.open(name, {
          initialLine: line,
          initialColumn: 0,
          activatePane: true,
          searchAllPanes: true
        });
      };
    };
    BreakpointPanel.render = function(state) {
      var brks, renderBreakPoint;
      renderBreakPoint = function(brk) {
        if (!brk.script) {
          return h('li.list-item');
        }
        return h('li.list-item', {
          'ev-click': goBreakpoint(brk)
        }, [brk.script.name + ":" + (brk.line + 1)]);
      };
      brks = state.breakpoints.map(renderBreakPoint);
      return ToggleTree.render(state.rootToggle, h('ul.list-tree', {}, brks));
    };
    return BreakpointPanel;
  };

}).call(this);
