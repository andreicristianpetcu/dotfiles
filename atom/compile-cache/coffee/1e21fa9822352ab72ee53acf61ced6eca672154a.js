(function() {
  var PROTOCOL, Promise, ToggleTree, exists, fs, h, hg, removeBreakListener;

  hg = require('mercury');

  Promise = require('bluebird');

  h = hg.h;

  fs = require('fs');

  ToggleTree = require('./ToggleTree');

  PROTOCOL = 'atom-node-debugger://';

  removeBreakListener = null;

  exists = function(path) {
    return new Promise(function(resolve) {
      return fs.exists(path, function(isExisted) {
        return resolve(isExisted);
      });
    });
  };

  exports.create = function(_debugger) {
    var CallStackPane, Frame, ObjectValue, Value, directValueView, functionValueView, undefinedValueView;
    CallStackPane = function() {
      var state;
      state = hg.state({
        rootToggle: ToggleTree.state('Call Stack'),
        frames: hg.array([])
      });
      removeBreakListener = _debugger.onBreak(function() {
        return _debugger.fullTrace().then(function(traces) {
          while ((state.frames().length)) {
            state.frames.pop();
          }
          return traces.frames.forEach(function(frame, idx) {
            frame = Frame(frame);
            return state.frames.push(frame);
          });
        });
      });
      return state;
    };
    directValueView = function(item) {
      return h('li.list-item', {}, [item.vname + ": " + item.value.value]);
    };
    undefinedValueView = function(value) {
      return h('li.list-item', {}, [String(value.vname) + ": undefined"]);
    };
    ObjectValue = function(value) {
      var state;
      state = hg.state({
        isOpen: hg.value(false),
        vname: hg.value(value.name),
        type: hg.value(value.value.type),
        loading: hg.value(false),
        loaded: hg.value(false),
        className: hg.value(value.value.className),
        ref: hg.value(value.value.ref),
        properties: hg.array([]),
        channels: {
          toggle: ObjectValue.toggleOnOff
        }
      });
      return state;
    };
    ObjectValue.toggleOnOff = function(state) {
      var isOpen, loaded, loading;
      isOpen = state.isOpen();
      loading = state.loading();
      loaded = state.loaded();
      state.isOpen.set(!isOpen);
      if (loading) {
        return;
      }
      if (loaded) {
        return;
      }
      state.loading.set(true);
      return _debugger.lookup(state.ref()).then(function(detail) {
        return Promise.map(detail.properties, function(prop) {
          return _debugger.lookup(prop.ref);
        }).then(function(values) {
          values.forEach(function(value, idx) {
            return detail.properties[idx].value = value;
          });
          return detail;
        });
      }).then(function(detail) {
        state.loaded.set(true);
        state.loading.set(false);
        return detail.properties.forEach(function(prop) {
          return state.properties.push(Value({
            name: prop.name,
            value: {
              ref: prop.ref,
              type: prop.value.type,
              className: prop.value.className,
              value: prop.value.value
            }
          }));
        });
      })["catch"](function(e) {
        state.loaded.set(false);
        return state.loading.set(false);
      });
    };
    ObjectValue.render = function(object) {
      var content;
      if (object.isOpen) {
        content = "" + object.vname + ": " + object.className;
      } else {
        content = "" + object.vname + " : " + object.className + " { ... }";
      }
      return h('li.list-nested-item', {
        className: object.isOpen ? '' : 'collapsed'
      }, [
        h('div.list-item', {
          'ev-click': hg.send(object.channels.toggle)
        }, [content]), h('ul.list-tree.object', {}, object.properties.map(Value.render))
      ]);
    };
    Value = function(value) {
      var v;
      v = value.value;
      if (v.type === 'object') {
        return ObjectValue(value);
      }
      return hg.state({
        vname: hg.value(value.name),
        type: hg.value(v.type),
        value: hg.value(value.value)
      });
    };
    Value.render = function(value) {
      var type;
      type = value.type;
      if (type === 'string') {
        return directValueView(value);
      }
      if (type === 'boolean') {
        return directValueView(value);
      }
      if (type === 'number') {
        return directValueView(value);
      }
      if (type === 'undefined') {
        return directValueView(value);
      }
      if (type === 'null') {
        return directValueView(value);
      }
      if (type === 'object') {
        return ObjectValue.render(value);
      }
      if (type === 'function') {
        return functionValueView(value);
      }
      return h('div', {}, ['unknown']);
    };
    functionValueView = function(value) {
      return h('li.list-item', {}, [String(value.vname) + ": function() { ... }"]);
    };
    Frame = function(frame) {
      return hg.state({
        script: hg.value(frame.script.name),
        scriptId: hg.value(frame.script.id),
        line: hg.value(frame.line),
        "arguments": hg.array(frame["arguments"].map(Value)),
        argumentsOn: hg.value(false),
        locals: hg.array(frame.locals.map(Value)),
        localsOn: hg.value(false),
        isOpen: hg.value(false),
        channels: {
          toggle: Frame.toggleOnOff,
          argumentToggle: Frame.onOff('argumentsOn'),
          localsToggle: Frame.onOff('localsOn')
        }
      });
    };
    Frame.onOff = function(type) {
      return function(state) {
        return state[type].set(!state[type]());
      };
    };
    Frame.toggleOnOff = function(state) {
      var isOpen;
      isOpen = state.isOpen();
      state.isOpen.set(!isOpen);
      return exists(state.script()).then(function(isExisted) {
        var newSourceName, promise;
        if (isExisted) {
          return promise = atom.workspace.open(state.script(), {
            initialLine: state.line(),
            initialColumn: 0,
            activatePane: true,
            searchAllPanes: true
          });
        } else {
          if (state.scriptId() == null) {
            return;
          }
          newSourceName = "" + PROTOCOL + (state.scriptId());
          return promise = atom.workspace.open(newSourceName, {
            initialColumn: 0,
            initialLine: state.line(),
            name: state.script(),
            searchAllPanes: true
          });
        }
      });
    };
    Frame.render = function(frame) {
      return h('ul.list-tree', {}, [
        h('li.list-nested-item', {
          className: frame.isOpen ? '' : 'collapsed'
        }, [
          h('div.list-item', {
            'ev-click': hg.send(frame.channels.toggle)
          }, ["" + frame.script + ":" + (frame.line + 1)]), h('ul.list-tree', {}, [
            h('li.list-nested-item', {
              className: frame.argumentsOn ? '' : 'collapsed'
            }, [
              h('div.list-item', {
                'ev-click': hg.send(frame.channels.argumentToggle)
              }, ['arguments']), h('ul.list-tree.arguments', {}, frame["arguments"].map(Value.render))
            ])
          ]), h('ul.list-tree', {}, [
            h('li.list-nested-item', {
              className: frame.localsOn ? '' : 'collapsed'
            }, [
              h('div.list-item', {
                'ev-click': hg.send(frame.channels.localsToggle)
              }, ['variables']), h('ul.list-tree.locals', {}, frame.locals.map(Value.render))
            ])
          ])
        ])
      ]);
    };
    CallStackPane.render = function(state) {
      var frames;
      frames = state.frames;
      return ToggleTree.render(state.rootToggle, frames.map(Frame.render));
    };
    return CallStackPane;
  };

  exports.cleanup = function() {
    if (removeBreakListener != null) {
      return removeBreakListener();
    }
  };

}).call(this);
