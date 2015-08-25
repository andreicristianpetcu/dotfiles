(function() {
  var path;

  path = require('path');

  describe('Autocomplete Snippets', function() {
    var autocompleteMain, autocompleteManager, completionDelay, editor, editorView, pathsMain, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], completionDelay = _ref[1], editor = _ref[2], editorView = _ref[3], pathsMain = _ref[4], autocompleteMain = _ref[5], autocompleteManager = _ref[6];
    beforeEach(function() {
      runs(function() {
        atom.config.set('autocomplete-plus.enableAutoActivation', true);
        completionDelay = 100;
        atom.config.set('autocomplete-plus.autoActivationDelay', completionDelay);
        completionDelay += 100;
        workspaceElement = atom.views.getView(atom.workspace);
        jasmine.attachToDOM(workspaceElement);
        autocompleteMain = atom.packages.loadPackage('autocomplete-plus').mainModule;
        spyOn(autocompleteMain, 'consumeProvider').andCallThrough();
        pathsMain = atom.packages.loadPackage('autocomplete-paths').mainModule;
        return spyOn(pathsMain, 'provide').andCallThrough();
      });
      waitsForPromise(function() {
        return atom.workspace.open('sample.js').then(function(e) {
          editor = e;
          return editorView = atom.views.getView(editor);
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-javascript');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('autocomplete-plus');
      });
      waitsFor(function() {
        var _ref1;
        return (_ref1 = autocompleteMain.autocompleteManager) != null ? _ref1.ready : void 0;
      });
      runs(function() {
        autocompleteManager = autocompleteMain.autocompleteManager;
        spyOn(autocompleteManager, 'findSuggestions').andCallThrough();
        spyOn(autocompleteManager, 'displaySuggestions').andCallThrough();
        spyOn(autocompleteManager, 'showSuggestionList').andCallThrough();
        return spyOn(autocompleteManager, 'hideSuggestionList').andCallThrough();
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('autocomplete-paths');
      });
      waitsFor(function() {
        return pathsMain.provide.calls.length === 1;
      });
      return waitsFor(function() {
        return autocompleteMain.consumeProvider.calls.length === 1;
      });
    });
    afterEach(function() {
      jasmine.unspy(autocompleteMain, 'consumeProvider');
      jasmine.unspy(pathsMain, 'provide');
      jasmine.unspy(autocompleteManager, 'findSuggestions');
      jasmine.unspy(autocompleteManager, 'displaySuggestions');
      jasmine.unspy(autocompleteManager, 'showSuggestionList');
      return jasmine.unspy(autocompleteManager, 'hideSuggestionList');
    });
    return describe('when autocomplete-plus is enabled', function() {
      it('shows autocompletions when typing ./', function() {
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('.');
          editor.insertText('/');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        return runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).toExist();
          expect(editorView.querySelector('.autocomplete-plus span.word')).toHaveText('linkeddir/');
          return expect(editorView.querySelector('.autocomplete-plus span.completion-label')).toHaveText('Dir');
        });
      });
      it('does not crash when typing an invalid folder', function() {
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('./sample.js');
          editor.insertText('/');
          return advanceClock(completionDelay);
        });
        return waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
      });
      it('does not crash when autocompleting symlinked paths', function() {
        runs(function() {
          var c, _i, _len, _ref1;
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          _ref1 = './linkedir';
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            c = _ref1[_i];
            editor.insertText(c);
          }
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        runs(function() {
          atom.commands.dispatch(editorView, 'autocomplete-plus:confirm');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 2;
        });
        return runs(function() {
          atom.commands.dispatch(editorView, 'autocomplete-plus:confirm');
          return advanceClock(completionDelay + 1000);
        });
      });
      return it('allows relative path completion without ./', function() {
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('linkeddir');
          editor.insertText('/');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        return runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).toExist();
          expect(editorView.querySelector('.autocomplete-plus span.word')).toHaveText('.gitkeep');
          return expect(editorView.querySelector('.autocomplete-plus span.completion-label')).toHaveText('File');
        });
      });
    });
  });

}).call(this);
