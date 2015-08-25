(function() {
  var CompositeDisposable, Selector, SymbolProvider, SymbolStore, TextEditor, fuzzaldrin, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore-plus');

  fuzzaldrin = require('fuzzaldrin');

  _ref = require('atom'), TextEditor = _ref.TextEditor, CompositeDisposable = _ref.CompositeDisposable;

  Selector = require('selector-kit').Selector;

  SymbolStore = require('./symbol-store');

  module.exports = SymbolProvider = (function() {
    SymbolProvider.prototype.wordRegex = /\b\w*[a-zA-Z_-]+\w*\b/g;

    SymbolProvider.prototype.beginningOfLineWordRegex = /^\w*[a-zA-Z_-]+\w*\b/g;

    SymbolProvider.prototype.endOfLineWordRegex = /\b\w*[a-zA-Z_-]+\w*$/g;

    SymbolProvider.prototype.symbolStore = null;

    SymbolProvider.prototype.editor = null;

    SymbolProvider.prototype.buffer = null;

    SymbolProvider.prototype.changeUpdateDelay = 300;

    SymbolProvider.prototype.selector = '*';

    SymbolProvider.prototype.inclusionPriority = 0;

    SymbolProvider.prototype.suggestionPriority = 0;

    SymbolProvider.prototype.watchedBuffers = null;

    SymbolProvider.prototype.config = null;

    SymbolProvider.prototype.defaultConfig = {
      "class": {
        selector: '.class.name, .inherited-class, .instance.type',
        typePriority: 4
      },
      "function": {
        selector: '.function.name',
        typePriority: 3
      },
      variable: {
        selector: '.variable',
        typePriority: 2
      },
      '': {
        selector: '.source',
        typePriority: 1
      }
    };

    function SymbolProvider() {
      this.buildSymbolList = __bind(this.buildSymbolList, this);
      this.buildWordListOnNextTick = __bind(this.buildWordListOnNextTick, this);
      this.getSuggestions = __bind(this.getSuggestions, this);
      this.updateCurrentEditor = __bind(this.updateCurrentEditor, this);
      this.watchEditor = __bind(this.watchEditor, this);
      this.dispose = __bind(this.dispose, this);
      this.watchedBuffers = new WeakMap;
      this.symbolStore = new SymbolStore(this.wordRegex);
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('autocomplete-plus.minimumWordLength', (function(_this) {
        return function(minimumWordLength) {
          _this.minimumWordLength = minimumWordLength;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('autocomplete-plus.includeCompletionsFromAllBuffers', (function(_this) {
        return function(includeCompletionsFromAllBuffers) {
          _this.includeCompletionsFromAllBuffers = includeCompletionsFromAllBuffers;
        };
      })(this)));
      this.subscriptions.add(atom.workspace.observeActivePaneItem(this.updateCurrentEditor));
      this.subscriptions.add(atom.workspace.observeTextEditors(this.watchEditor));
    }

    SymbolProvider.prototype.dispose = function() {
      return this.subscriptions.dispose();
    };

    SymbolProvider.prototype.watchEditor = function(editor) {
      var buffer, bufferEditors, bufferSubscriptions, editorSubscriptions;
      buffer = editor.getBuffer();
      editorSubscriptions = new CompositeDisposable;
      editorSubscriptions.add(editor.displayBuffer.onDidTokenize((function(_this) {
        return function() {
          return _this.buildWordListOnNextTick(editor);
        };
      })(this)));
      editorSubscriptions.add(editor.onDidDestroy((function(_this) {
        return function() {
          var editors, index;
          index = _this.getWatchedEditorIndex(editor);
          editors = _this.watchedBuffers.get(editor.getBuffer());
          if (index > -1) {
            editors.splice(index, 1);
          }
          return editorSubscriptions.dispose();
        };
      })(this)));
      if (bufferEditors = this.watchedBuffers.get(buffer)) {
        return bufferEditors.push(editor);
      } else {
        bufferSubscriptions = new CompositeDisposable;
        bufferSubscriptions.add(buffer.onWillChange((function(_this) {
          return function(_arg) {
            var editors, newRange, oldRange;
            oldRange = _arg.oldRange, newRange = _arg.newRange;
            editors = _this.watchedBuffers.get(buffer);
            if (editors && editors.length && (editor = editors[0])) {
              _this.symbolStore.removeTokensInBufferRange(editor, oldRange);
              return _this.symbolStore.adjustBufferRows(editor, oldRange, newRange);
            }
          };
        })(this)));
        bufferSubscriptions.add(buffer.onDidChange((function(_this) {
          return function(_arg) {
            var editors, newRange;
            newRange = _arg.newRange;
            editors = _this.watchedBuffers.get(buffer);
            if (editors && editors.length && (editor = editors[0])) {
              return _this.symbolStore.addTokensInBufferRange(editor, newRange);
            }
          };
        })(this)));
        bufferSubscriptions.add(buffer.onDidDestroy((function(_this) {
          return function() {
            _this.symbolStore.clear(buffer);
            bufferSubscriptions.dispose();
            return _this.watchedBuffers["delete"](buffer);
          };
        })(this)));
        this.watchedBuffers.set(buffer, [editor]);
        return this.buildWordListOnNextTick(editor);
      }
    };

    SymbolProvider.prototype.isWatchingEditor = function(editor) {
      return this.getWatchedEditorIndex(editor) > -1;
    };

    SymbolProvider.prototype.isWatchingBuffer = function(buffer) {
      return this.watchedBuffers.get(buffer) != null;
    };

    SymbolProvider.prototype.getWatchedEditorIndex = function(editor) {
      var editors;
      if (editors = this.watchedBuffers.get(editor.getBuffer())) {
        return editors.indexOf(editor);
      } else {
        return -1;
      }
    };

    SymbolProvider.prototype.updateCurrentEditor = function(currentPaneItem) {
      if (currentPaneItem == null) {
        return;
      }
      if (currentPaneItem === this.editor) {
        return;
      }
      this.editor = null;
      if (this.paneItemIsValid(currentPaneItem)) {
        return this.editor = currentPaneItem;
      }
    };

    SymbolProvider.prototype.buildConfigIfScopeChanged = function(_arg) {
      var editor, scopeDescriptor;
      editor = _arg.editor, scopeDescriptor = _arg.scopeDescriptor;
      if (!this.scopeDescriptorsEqual(this.configScopeDescriptor, scopeDescriptor)) {
        this.buildConfig(scopeDescriptor);
        return this.configScopeDescriptor = scopeDescriptor;
      }
    };

    SymbolProvider.prototype.buildConfig = function(scopeDescriptor) {
      var addedConfigEntry, allConfigEntries, legacyCompletions, value, _i, _j, _len, _len1;
      this.config = {};
      legacyCompletions = this.settingsForScopeDescriptor(scopeDescriptor, 'editor.completions');
      allConfigEntries = this.settingsForScopeDescriptor(scopeDescriptor, 'autocomplete.symbols');
      allConfigEntries.reverse();
      for (_i = 0, _len = legacyCompletions.length; _i < _len; _i++) {
        value = legacyCompletions[_i].value;
        if (Array.isArray(value) && value.length) {
          this.addLegacyConfigEntry(value);
        }
      }
      addedConfigEntry = false;
      for (_j = 0, _len1 = allConfigEntries.length; _j < _len1; _j++) {
        value = allConfigEntries[_j].value;
        if (!Array.isArray(value) && typeof value === 'object') {
          this.addConfigEntry(value);
          addedConfigEntry = true;
        }
      }
      if (!addedConfigEntry) {
        return this.addConfigEntry(this.defaultConfig);
      }
    };

    SymbolProvider.prototype.addLegacyConfigEntry = function(suggestions) {
      var suggestion, _base;
      suggestions = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = suggestions.length; _i < _len; _i++) {
          suggestion = suggestions[_i];
          _results.push({
            text: suggestion,
            type: 'builtin'
          });
        }
        return _results;
      })();
      if ((_base = this.config).builtin == null) {
        _base.builtin = {
          suggestions: []
        };
      }
      return this.config.builtin.suggestions = this.config.builtin.suggestions.concat(suggestions);
    };

    SymbolProvider.prototype.addConfigEntry = function(config) {
      var options, suggestions, type, _base, _ref1;
      for (type in config) {
        options = config[type];
        if ((_base = this.config)[type] == null) {
          _base[type] = {};
        }
        if (options.selector != null) {
          this.config[type].selectors = Selector.create(options.selector);
        }
        this.config[type].typePriority = (_ref1 = options.typePriority) != null ? _ref1 : 1;
        this.config[type].wordRegex = this.wordRegex;
        suggestions = this.sanitizeSuggestionsFromConfig(options.suggestions, type);
        if ((suggestions != null) && suggestions.length) {
          this.config[type].suggestions = suggestions;
        }
      }
    };

    SymbolProvider.prototype.sanitizeSuggestionsFromConfig = function(suggestions, type) {
      var sanitizedSuggestions, suggestion, _i, _len;
      if ((suggestions != null) && Array.isArray(suggestions)) {
        sanitizedSuggestions = [];
        for (_i = 0, _len = suggestions.length; _i < _len; _i++) {
          suggestion = suggestions[_i];
          if (typeof suggestion === 'string') {
            sanitizedSuggestions.push({
              text: suggestion,
              type: type
            });
          } else if (typeof suggestions[0] === 'object' && ((suggestion.text != null) || (suggestion.snippet != null))) {
            suggestion = _.clone(suggestion);
            if (suggestion.type == null) {
              suggestion.type = type;
            }
            sanitizedSuggestions.push(suggestion);
          }
        }
        return sanitizedSuggestions;
      } else {
        return null;
      }
    };

    SymbolProvider.prototype.uniqueFilter = function(completion) {
      return completion.text;
    };

    SymbolProvider.prototype.paneItemIsValid = function(paneItem) {
      if (paneItem == null) {
        return false;
      }
      return paneItem instanceof TextEditor;
    };


    /*
    Section: Suggesting Completions
     */

    SymbolProvider.prototype.getSuggestions = function(options) {
      var buffer, bufferPosition, cursor, editor, numberOfWordsMatchingPrefix, prefix, symbolList, word, wordUnderCursor, words, _i, _j, _len, _len1, _ref1, _ref2;
      prefix = (_ref1 = options.prefix) != null ? _ref1.trim() : void 0;
      if (!((prefix != null ? prefix.length : void 0) && (prefix != null ? prefix.length : void 0) >= this.minimumWordLength)) {
        return;
      }
      if (!this.symbolStore.getLength()) {
        return;
      }
      this.buildConfigIfScopeChanged(options);
      editor = options.editor, prefix = options.prefix, bufferPosition = options.bufferPosition;
      numberOfWordsMatchingPrefix = 1;
      wordUnderCursor = this.wordAtBufferPosition(editor, bufferPosition);
      _ref2 = editor.getCursors();
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        cursor = _ref2[_i];
        if (cursor === editor.getLastCursor()) {
          continue;
        }
        word = this.wordAtBufferPosition(editor, cursor.getBufferPosition());
        if (word === wordUnderCursor) {
          numberOfWordsMatchingPrefix += 1;
        }
      }
      buffer = this.includeCompletionsFromAllBuffers ? null : this.editor.getBuffer();
      symbolList = this.symbolStore.symbolsForConfig(this.config, buffer, wordUnderCursor, numberOfWordsMatchingPrefix);
      words = atom.config.get("autocomplete-plus.strictMatching") ? symbolList.filter(function(match) {
        var _ref3;
        return ((_ref3 = match.text) != null ? _ref3.indexOf(options.prefix) : void 0) === 0;
      }) : this.fuzzyFilter(symbolList, this.editor.getBuffer(), options);
      for (_j = 0, _len1 = words.length; _j < _len1; _j++) {
        word = words[_j];
        word.replacementPrefix = options.prefix;
      }
      return words;
    };

    SymbolProvider.prototype.wordAtBufferPosition = function(editor, bufferPosition) {
      var lineFromPosition, lineToPosition, prefix, suffix, _ref1, _ref2;
      lineToPosition = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      prefix = ((_ref1 = lineToPosition.match(this.endOfLineWordRegex)) != null ? _ref1[0] : void 0) || '';
      lineFromPosition = editor.getTextInRange([bufferPosition, [bufferPosition.row, Infinity]]);
      suffix = ((_ref2 = lineFromPosition.match(this.beginningOfLineWordRegex)) != null ? _ref2[0] : void 0) || '';
      return prefix + suffix;
    };

    SymbolProvider.prototype.fuzzyFilter = function(symbolList, buffer, _arg) {
      var bufferPosition, candidates, index, locality, prefix, results, rowDifference, score, symbol, text, _i, _j, _len, _len1, _ref1;
      bufferPosition = _arg.bufferPosition, prefix = _arg.prefix;
      candidates = [];
      for (_i = 0, _len = symbolList.length; _i < _len; _i++) {
        symbol = symbolList[_i];
        text = symbol.snippet || symbol.text;
        if (!(text && prefix[0].toLowerCase() === text[0].toLowerCase())) {
          continue;
        }
        score = fuzzaldrin.score(text, prefix);
        score *= this.getLocalityScore(bufferPosition, typeof symbol.bufferRowsForBuffer === "function" ? symbol.bufferRowsForBuffer(buffer) : void 0);
        if (score > 0) {
          candidates.push({
            symbol: symbol,
            score: score,
            locality: locality,
            rowDifference: rowDifference
          });
        }
      }
      candidates.sort(this.symbolSortReverseIterator);
      results = [];
      for (index = _j = 0, _len1 = candidates.length; _j < _len1; index = ++_j) {
        _ref1 = candidates[index], symbol = _ref1.symbol, score = _ref1.score, locality = _ref1.locality, rowDifference = _ref1.rowDifference;
        if (index === 20) {
          break;
        }
        results.push(symbol);
      }
      return results;
    };

    SymbolProvider.prototype.symbolSortReverseIterator = function(a, b) {
      return b.score - a.score;
    };

    SymbolProvider.prototype.getLocalityScore = function(bufferPosition, bufferRowsContainingSymbol) {
      var bufferRow, locality, rowDifference, _i, _len;
      if (bufferRowsContainingSymbol != null) {
        rowDifference = Number.MAX_VALUE;
        for (_i = 0, _len = bufferRowsContainingSymbol.length; _i < _len; _i++) {
          bufferRow = bufferRowsContainingSymbol[_i];
          rowDifference = Math.min(rowDifference, bufferRow - bufferPosition.row);
        }
        locality = this.computeLocalityModifier(rowDifference);
        return locality;
      } else {
        return 1;
      }
    };

    SymbolProvider.prototype.computeLocalityModifier = function(rowDifference) {
      rowDifference = Math.abs(rowDifference);
      return 1 + Math.max(-Math.pow(.2 * rowDifference - 3, 3) / 25 + .5, 0);
    };

    SymbolProvider.prototype.settingsForScopeDescriptor = function(scopeDescriptor, keyPath) {
      return atom.config.getAll(keyPath, {
        scope: scopeDescriptor
      });
    };


    /*
    Section: Word List Building
     */

    SymbolProvider.prototype.buildWordListOnNextTick = function(editor) {
      return _.defer((function(_this) {
        return function() {
          return _this.buildSymbolList(editor);
        };
      })(this));
    };

    SymbolProvider.prototype.buildSymbolList = function(editor) {
      if (!(editor != null ? editor.isAlive() : void 0)) {
        return;
      }
      this.symbolStore.clear(editor.getBuffer());
      return this.symbolStore.addTokensInBufferRange(editor, editor.getBuffer().getRange());
    };

    SymbolProvider.prototype.scopeDescriptorsEqual = function(a, b) {
      var arrayA, arrayB, i, scope, _i, _len;
      if (a === b) {
        return true;
      }
      if (!((a != null) && (b != null))) {
        return false;
      }
      arrayA = a.getScopesArray();
      arrayB = b.getScopesArray();
      if (arrayA.length !== arrayB.length) {
        return false;
      }
      for (i = _i = 0, _len = arrayA.length; _i < _len; i = ++_i) {
        scope = arrayA[i];
        if (scope !== arrayB[i]) {
          return false;
        }
      }
      return true;
    };

    return SymbolProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBRUE7QUFBQSxNQUFBLDJGQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsWUFBUixDQURiLENBQUE7O0FBQUEsRUFFQSxPQUFxQyxPQUFBLENBQVEsTUFBUixDQUFyQyxFQUFDLGtCQUFBLFVBQUQsRUFBYSwyQkFBQSxtQkFGYixDQUFBOztBQUFBLEVBR0MsV0FBWSxPQUFBLENBQVEsY0FBUixFQUFaLFFBSEQsQ0FBQTs7QUFBQSxFQUlBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FKZCxDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDZCQUFBLFNBQUEsR0FBVyx3QkFBWCxDQUFBOztBQUFBLDZCQUNBLHdCQUFBLEdBQTBCLHVCQUQxQixDQUFBOztBQUFBLDZCQUVBLGtCQUFBLEdBQW9CLHVCQUZwQixDQUFBOztBQUFBLDZCQUdBLFdBQUEsR0FBYSxJQUhiLENBQUE7O0FBQUEsNkJBSUEsTUFBQSxHQUFRLElBSlIsQ0FBQTs7QUFBQSw2QkFLQSxNQUFBLEdBQVEsSUFMUixDQUFBOztBQUFBLDZCQU1BLGlCQUFBLEdBQW1CLEdBTm5CLENBQUE7O0FBQUEsNkJBUUEsUUFBQSxHQUFVLEdBUlYsQ0FBQTs7QUFBQSw2QkFTQSxpQkFBQSxHQUFtQixDQVRuQixDQUFBOztBQUFBLDZCQVVBLGtCQUFBLEdBQW9CLENBVnBCLENBQUE7O0FBQUEsNkJBWUEsY0FBQSxHQUFnQixJQVpoQixDQUFBOztBQUFBLDZCQWNBLE1BQUEsR0FBUSxJQWRSLENBQUE7O0FBQUEsNkJBZUEsYUFBQSxHQUNFO0FBQUEsTUFBQSxPQUFBLEVBQ0U7QUFBQSxRQUFBLFFBQUEsRUFBVSwr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
//# sourceURL=/home/andrei/dotfiles/atom/packages/autocomplete-plus/lib/symbol-provider.coffee