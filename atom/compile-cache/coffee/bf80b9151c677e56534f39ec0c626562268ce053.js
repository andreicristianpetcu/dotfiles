(function() {
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
        return atom.workspace.open('').then(function(e) {
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
    return describe('when opening a large file', function() {
      return it('provides suggestions in a timely way', function() {
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('h');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        runs(function() {
          editor.insertText('t');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 2;
        });
        runs(function() {
          editor.insertText('t');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 3;
        });
        runs(function() {
          editor.insertText('p');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 4;
        });
        runs(function() {
          editor.insertText('s');
          return advanceClock(completionDelay);
        });
        return waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 5;
        });
      });
    });
  });

}).call(this);
