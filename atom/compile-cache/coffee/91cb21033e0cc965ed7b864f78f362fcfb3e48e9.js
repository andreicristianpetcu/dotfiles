(function() {
  var Fs, Path, readFile;

  Path = require("path");

  Fs = require("fs");

  readFile = function(path) {
    return Fs.readFileSync(Path.join(__dirname, "./fixtures/", path), "utf8");
  };

  describe("Emmet", function() {
    var editor, editorElement, simulateTabKeyEvent, _ref;
    _ref = [], editor = _ref[0], editorElement = _ref[1];
    console.log(atom.keymaps.onDidMatchBinding(function(event) {
      return console.log('Matched keybinding', event);
    }));
    simulateTabKeyEvent = function() {
      var event;
      event = keydownEvent("tab", {
        target: editorElement
      });
      return atom.keymaps.handleKeyboardEvent(event.originalEvent);
    };
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open("tabbing.html");
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("emmet");
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("snippets");
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-css", {
          sync: true
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-sass", {
          sync: true
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-php", {
          sync: true
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-html", {
          sync: true
        });
      });
      return runs(function() {
        var _ref1, _ref2;
        if ((_ref1 = atom.packages.getLoadedPackage('snippets')) != null) {
          if ((_ref2 = _ref1.mainModule) != null) {
            _ref2.getEmitter();
          }
        }
        editor = atom.workspace.getActiveTextEditor();
        return editorElement = atom.views.getView(editor);
      });
    });
    describe("tabbing", function() {
      beforeEach(function() {
        atom.workspace.open('tabbing.html');
        return editor.setCursorScreenPosition([1, 4]);
      });
      return it("moves the cursor along", function() {
        var cursorPos;
        simulateTabKeyEvent();
        cursorPos = editor.getCursorScreenPosition();
        return expect(cursorPos.column).toBe(6);
      });
    });
    return describe("emmet:expand-abbreviation", function() {
      var expansion;
      expansion = null;
      return describe("for normal HTML", function() {
        beforeEach(function() {
          editor.setText(readFile("abbreviation/before/html-abbrv.html"));
          editor.moveToEndOfLine();
          return expansion = readFile("abbreviation/after/html-abbrv.html");
        });
        it("expands HTML abbreviations via commands", function() {
          atom.commands.dispatch(editorElement, "emmet:expand-abbreviation");
          return expect(editor.getText()).toBe(expansion);
        });
        it("expands HTML abbreviations via keybindings", function() {
          var event;
          event = keydownEvent('e', {
            shiftKey: true,
            metaKey: true,
            target: editorElement
          });
          atom.keymaps.handleKeyboardEvent(event.originalEvent);
          return expect(editor.getText()).toBe(expansion);
        });
        return it("expands HTML abbreviations via Tab", function() {
          console.log(atom.keymaps.findKeyBindings({
            keystrokes: 'tab'
          }));
          simulateTabKeyEvent();
          return expect(editor.getText()).toBe(expansion);
        });
      });
    });
  });

}).call(this);
