(function() {
  var CommandHistory, Event, TextEditorView, h, hg, merge, split, stream, _ref;

  TextEditorView = require('atom-space-pen-views').TextEditorView;

  Event = require('geval/event');

  _ref = require('event-stream'), merge = _ref.merge, split = _ref.split;

  stream = require('stream');

  hg = require('mercury');

  h = hg.h;

  CommandHistory = require('./consolepane-utils').CommandHistory;

  exports.create = function(_debugger) {
    var ConsoleInput, ConsolePane, input, jsGrammar, tokenizeLine;
    jsGrammar = atom.grammars.grammarForScopeName('source.js');
    tokenizeLine = function(text) {
      var tokens;
      tokens = jsGrammar.tokenizeLine(text).tokens;
      return h('div.line', {}, [
        h('span.test.shell-session', {}, tokens.map(function(token) {
          return h('span', {
            className: token.scopes.join(' ').split('.').join(' ')
          }, [token.value]);
        }))
      ]);
    };
    ConsoleInput = (function() {
      function ConsoleInput(_debugger1) {
        this["debugger"] = _debugger1;
        this.type = "Widget";
        this._changer = Event();
        this.onEvalOrResult = this._changer.listen;
      }

      ConsoleInput.prototype.init = function() {
        var self;
        self = this;
        this.editorView = new TextEditorView({
          mini: true
        });
        this.editor = this.editorView.getModel();
        this.historyTracker = new CommandHistory(this.editor);
        this.editorView.on('keyup', function(ev) {
          var keyCode, text;
          keyCode = ev.keyCode;
          switch (keyCode) {
            case 13:
              text = self.editor.getText();
              self._changer.broadcast(text);
              self.editor.setText('');
              self.historyTracker.saveIfNew(text);
              return self["debugger"]["eval"](text).then(function(result) {
                return self._changer.broadcast(result.text);
              })["catch"](function(e) {
                if (e.message != null) {
                  return self._changer.broadcast(e.message);
                } else {
                  return self._changer.broadcast(e);
                }
              });
            case 38:
              return self.historyTracker.moveUp();
            case 40:
              return self.historyTracker.moveDown();
          }
        });
        return this.editorView.get(0);
      };

      ConsoleInput.prototype.update = function(prev, el) {
        return el;
      };

      return ConsoleInput;

    })();
    input = new ConsoleInput(_debugger);
    ConsolePane = function() {
      var newWriter, state;
      state = hg.state({
        lines: hg.array([])
      });
      input.onEvalOrResult(function(text) {
        return state.lines.push(text);
      });
      newWriter = function() {
        return new stream.Writable({
          write: function(chunk, encoding, next) {
            state.lines.push(chunk.toString());
            return next();
          }
        });
      };
      _debugger.processManager.on('procssCreated', function() {
        var stderr, stdout, _ref1;
        _ref1 = _debugger.processManager.process, stdout = _ref1.stdout, stderr = _ref1.stderr;
        stdout.on('data', function(d) {
          return console.log(d.toString());
        });
        stderr.on('data', function(d) {
          return console.log(d.toString());
        });
        stdout.pipe(split()).pipe(newWriter());
        return stderr.pipe(split()).pipe(newWriter());
      });
      return state;
    };
    ConsolePane.render = function(state) {
      return h('div.inset-panel', {
        style: {
          flex: '1 1 0',
          display: 'flex',
          flexDirection: 'column'
        }
      }, [
        h('div.debugger-panel-heading', {}, ['stdout/stderr']), h('div.panel-body.padded', {
          style: {
            flex: '1',
            overflow: 'auto'
          }
        }, state.lines.map(tokenizeLine)), h('div.debugger-editor', {
          style: {
            height: '33px',
            flexBasis: '33px'
          }
        }, [input])
      ]);
    };
    return ConsolePane;
  };

  exports.cleanup = function() {};

}).call(this);
