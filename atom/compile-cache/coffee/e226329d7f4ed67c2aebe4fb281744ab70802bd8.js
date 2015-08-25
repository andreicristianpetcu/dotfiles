(function() {
  var CommandHistory, FakeEditor;

  CommandHistory = require('../../lib/Components/consolepane-utils').CommandHistory;

  FakeEditor = (function() {
    function FakeEditor() {}

    FakeEditor.prototype.setText = function(text) {
      return this.text = text;
    };

    return FakeEditor;

  })();

  describe('CommandHistory', function() {
    var editor, history;
    editor = null;
    history = null;
    beforeEach(function() {
      editor = new FakeEditor();
      return history = new CommandHistory(editor);
    });
    describe('.saveIfNew', function() {
      it('saves a command if no previous commands has been saved', function() {
        history.saveIfNew('command1');
        expect(editor.text != null).toBe(false);
        expect(history.cmdHistory.length).toBe(1);
        return expect(history.cmdHistory[0]).toBe('command1');
      });
      it('saves a sequence of unique commands', function() {
        history.saveIfNew('command1');
        history.saveIfNew('command2');
        history.saveIfNew('command3');
        expect(editor.text != null).toBe(false);
        expect(history.cmdHistory.length).toBe(3);
        expect(history.cmdHistory[0]).toBe('command1');
        expect(history.cmdHistory[1]).toBe('command2');
        return expect(history.cmdHistory[2]).toBe('command3');
      });
      it('does not save a command that matches the current', function() {
        history.saveIfNew('command1');
        history.saveIfNew('command2');
        history.saveIfNew('command3');
        expect(history.cmdHistory.length).toBe(3);
        history.moveUp();
        expect(editor.text).toBe('command3');
        history.saveIfNew(editor.text);
        expect(history.cmdHistory.length).toBe(3);
        expect(history.cmdHistory[0]).toBe('command1');
        expect(history.cmdHistory[1]).toBe('command2');
        return expect(history.cmdHistory[2]).toBe('command3');
      });
      return it('saves a new command at the end even when traversing history', function() {
        history.saveIfNew('command1');
        history.saveIfNew('command2');
        history.saveIfNew('command3');
        expect(history.cmdHistory.length).toBe(3);
        history.moveUp();
        history.moveUp();
        expect(editor.text).toBe('command2');
        editor.text = 'command4';
        history.saveIfNew(editor.text);
        expect(history.cmdHistory.length).toBe(4);
        expect(history.cmdHistory[0]).toBe('command1');
        expect(history.cmdHistory[1]).toBe('command2');
        expect(history.cmdHistory[2]).toBe('command3');
        return expect(history.cmdHistory[3]).toBe('command4');
      });
    });
    describe('.moveUp', function() {
      it('has no effect if no previous commands has been saved', function() {
        history.moveUp();
        return expect(editor.text != null).toBe(false);
      });
      it('moves to last command when first called', function() {
        history.saveIfNew('command1');
        history.saveIfNew('command2');
        history.saveIfNew('command3');
        history.moveUp();
        return expect(editor.text).toBe('command3');
      });
      it('moves to previous command when called repeatedly', function() {
        history.saveIfNew('command1');
        history.saveIfNew('command2');
        history.saveIfNew('command3');
        history.moveUp();
        history.moveUp();
        return expect(editor.text).toBe('command2');
      });
      it('has no effect if already at first command', function() {
        history.saveIfNew('command1');
        history.saveIfNew('command2');
        history.saveIfNew('command3');
        history.moveUp();
        history.moveUp();
        history.moveUp();
        expect(editor.text).toBe('command1');
        history.moveUp();
        return expect(editor.text).toBe('command1');
      });
      return it('resumes history traversal even if the editor text is changed manually', function() {
        history.saveIfNew('command1');
        history.saveIfNew('command2');
        history.saveIfNew('command3');
        history.moveUp();
        expect(editor.text).toBe('command3');
        editor.text = 'some other text';
        history.moveUp();
        return expect(editor.text).toBe('command2');
      });
    });
    return describe('.moveDown', function() {
      it('has no effect if no previous commands has been saved', function() {
        history.moveDown();
        return expect(editor.text != null).toBe(false);
      });
      it('has no effect if a command was saved and history traversal is not started', function() {
        history.saveIfNew('command1');
        history.saveIfNew('command2');
        history.saveIfNew('command3');
        history.moveDown();
        return expect(editor.text != null).toBe(false);
      });
      it('moves to the next command when called during a history traversal', function() {
        history.saveIfNew('command1');
        history.saveIfNew('command2');
        history.saveIfNew('command3');
        history.moveUp();
        history.moveUp();
        expect(editor.text).toBe('command2');
        history.moveDown();
        return expect(editor.text).toBe('command3');
      });
      return it('has no effect when already at the last command', function() {
        history.saveIfNew('command1');
        history.saveIfNew('command2');
        history.saveIfNew('command3');
        history.moveUp();
        history.moveUp();
        expect(editor.text).toBe('command2');
        history.moveDown();
        expect(editor.text).toBe('command3');
        history.moveDown();
        return expect(editor.text).toBe('command3');
      });
    });
  });

}).call(this);
