(function() {
  var AutocompleteManager, CompositeDisposable, Disposable, ProviderManager, Range, SuggestionList, SuggestionListElement, TextEditor, fuzzaldrin, grim, minimatch, path, semver, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom'), Range = _ref.Range, TextEditor = _ref.TextEditor, CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  path = require('path');

  semver = require('semver');

  fuzzaldrin = require('fuzzaldrin');

  ProviderManager = require('./provider-manager');

  SuggestionList = require('./suggestion-list');

  SuggestionListElement = require('./suggestion-list-element');

  minimatch = null;

  grim = null;

  module.exports = AutocompleteManager = (function() {
    AutocompleteManager.prototype.autosaveEnabled = false;

    AutocompleteManager.prototype.backspaceTriggersAutocomplete = true;

    AutocompleteManager.prototype.bracketMatcherPairs = ['()', '[]', '{}', '""', "''", '``', "“”", '‘’', "«»", "‹›"];

    AutocompleteManager.prototype.buffer = null;

    AutocompleteManager.prototype.compositionInProgress = false;

    AutocompleteManager.prototype.disposed = false;

    AutocompleteManager.prototype.editor = null;

    AutocompleteManager.prototype.editorSubscriptions = null;

    AutocompleteManager.prototype.editorView = null;

    AutocompleteManager.prototype.providerManager = null;

    AutocompleteManager.prototype.ready = false;

    AutocompleteManager.prototype.subscriptions = null;

    AutocompleteManager.prototype.suggestionDelay = 50;

    AutocompleteManager.prototype.suggestionList = null;

    AutocompleteManager.prototype.suppressForClasses = [];

    AutocompleteManager.prototype.shouldDisplaySuggestions = false;

    AutocompleteManager.prototype.prefixRegex = /(\b|['"~`!@#\$%^&*\(\)\{\}\[\]=\+,/\?>])((\w+[\w-]*)|([.:;[{(< ]+))$/;

    AutocompleteManager.prototype.wordPrefixRegex = /^\w+[\w-]*$/;

    function AutocompleteManager() {
      this.dispose = __bind(this.dispose, this);
      this.bufferChanged = __bind(this.bufferChanged, this);
      this.bufferSaved = __bind(this.bufferSaved, this);
      this.cursorMoved = __bind(this.cursorMoved, this);
      this.requestNewSuggestions = __bind(this.requestNewSuggestions, this);
      this.isCurrentFileBlackListed = __bind(this.isCurrentFileBlackListed, this);
      this.replaceTextWithMatch = __bind(this.replaceTextWithMatch, this);
      this.hideSuggestionList = __bind(this.hideSuggestionList, this);
      this.confirm = __bind(this.confirm, this);
      this.displaySuggestions = __bind(this.displaySuggestions, this);
      this.getSuggestionsFromProviders = __bind(this.getSuggestionsFromProviders, this);
      this.findSuggestions = __bind(this.findSuggestions, this);
      this.handleCommands = __bind(this.handleCommands, this);
      this.handleEvents = __bind(this.handleEvents, this);
      this.updateCurrentEditor = __bind(this.updateCurrentEditor, this);
      this.subscriptions = new CompositeDisposable;
      this.providerManager = new ProviderManager;
      this.suggestionList = new SuggestionList;
      this.subscriptions.add(this.providerManager);
      this.subscriptions.add(atom.views.addViewProvider(SuggestionList, function(model) {
        return new SuggestionListElement().initialize(model);
      }));
      this.handleEvents();
      this.handleCommands();
      this.subscriptions.add(this.suggestionList);
      this.ready = true;
    }

    AutocompleteManager.prototype.setSnippetsManager = function(snippetsManager) {
      this.snippetsManager = snippetsManager;
    };

    AutocompleteManager.prototype.updateCurrentEditor = function(currentPaneItem) {
      var compositionEnd, compositionStart, _ref1;
      if ((currentPaneItem == null) || currentPaneItem === this.editor) {
        return;
      }
      if ((_ref1 = this.editorSubscriptions) != null) {
        _ref1.dispose();
      }
      this.editorSubscriptions = null;
      this.editor = null;
      this.editorView = null;
      this.buffer = null;
      this.isCurrentFileBlackListedCache = null;
      if (!this.paneItemIsValid(currentPaneItem)) {
        return;
      }
      this.editor = currentPaneItem;
      this.editorView = atom.views.getView(this.editor);
      this.buffer = this.editor.getBuffer();
      this.editorSubscriptions = new CompositeDisposable;
      this.editorSubscriptions.add(this.buffer.onDidSave(this.bufferSaved));
      this.editorSubscriptions.add(this.buffer.onDidChange(this.bufferChanged));
      compositionStart = (function(_this) {
        return function() {
          return _this.compositionInProgress = true;
        };
      })(this);
      compositionEnd = (function(_this) {
        return function() {
          return _this.compositionInProgress = false;
        };
      })(this);
      this.editorView.addEventListener('compositionstart', compositionStart);
      this.editorView.addEventListener('compositionend', compositionEnd);
      this.editorSubscriptions.add(new Disposable(function() {
        var _ref2, _ref3;
        if ((_ref2 = this.editorView) != null) {
          _ref2.removeEventListener('compositionstart', compositionStart);
        }
        return (_ref3 = this.editorView) != null ? _ref3.removeEventListener('compositionend', compositionEnd) : void 0;
      }));
      this.editorSubscriptions.add(this.editor.onDidChangeCursorPosition(this.cursorMoved));
      return this.editorSubscriptions.add(this.editor.onDidChangePath((function(_this) {
        return function() {
          return _this.isCurrentFileBlackListedCache = null;
        };
      })(this)));
    };

    AutocompleteManager.prototype.paneItemIsValid = function(paneItem) {
      if (paneItem == null) {
        return false;
      }
      return paneItem instanceof TextEditor;
    };

    AutocompleteManager.prototype.handleEvents = function() {
      this.subscriptions.add(atom.workspace.observeActivePaneItem(this.updateCurrentEditor));
      this.subscriptions.add(atom.config.observe('autosave.enabled', (function(_this) {
        return function(value) {
          return _this.autosaveEnabled = value;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('autocomplete-plus.backspaceTriggersAutocomplete', (function(_this) {
        return function(value) {
          return _this.backspaceTriggersAutocomplete = value;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('autocomplete-plus.enableAutoActivation', (function(_this) {
        return function(value) {
          return _this.autoActivationEnabled = value;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('autocomplete-plus.fileBlacklist', (function(_this) {
        return function(value) {
          _this.fileBlacklist = value != null ? value.map(function(s) {
            return s.trim();
          }) : void 0;
          return _this.isCurrentFileBlackListedCache = null;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('autocomplete-plus.suppressActivationForEditorClasses', (function(_this) {
        return function(value) {
          var className, classes, selector, _i, _len;
          _this.suppressForClasses = [];
          for (_i = 0, _len = value.length; _i < _len; _i++) {
            selector = value[_i];
            classes = (function() {
              var _j, _len1, _ref1, _results;
              _ref1 = selector.trim().split('.');
              _results = [];
              for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                className = _ref1[_j];
                if (className.trim()) {
                  _results.push(className.trim());
                }
              }
              return _results;
            })();
            if (classes.length) {
              _this.suppressForClasses.push(classes);
            }
          }
        };
      })(this)));
      this.subscriptions.add(this.suggestionList.onDidConfirm(this.confirm));
      return this.subscriptions.add(this.suggestionList.onDidCancel(this.hideSuggestionList));
    };

    AutocompleteManager.prototype.handleCommands = function() {
      return this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'autocomplete-plus:activate': (function(_this) {
          return function(event) {
            var _ref1, _ref2;
            _this.shouldDisplaySuggestions = true;
            return _this.findSuggestions((_ref1 = (_ref2 = event.detail) != null ? _ref2.activatedManually : void 0) != null ? _ref1 : true);
          };
        })(this)
      }));
    };

    AutocompleteManager.prototype.findSuggestions = function(activatedManually) {
      var bufferPosition, cursor, prefix, scopeDescriptor;
      if (this.disposed) {
        return;
      }
      if (!((this.providerManager != null) && (this.editor != null) && (this.buffer != null))) {
        return;
      }
      if (this.isCurrentFileBlackListed()) {
        return;
      }
      cursor = this.editor.getLastCursor();
      if (cursor == null) {
        return;
      }
      bufferPosition = cursor.getBufferPosition();
      scopeDescriptor = cursor.getScopeDescriptor();
      prefix = this.getPrefix(this.editor, bufferPosition);
      return this.getSuggestionsFromProviders({
        editor: this.editor,
        bufferPosition: bufferPosition,
        scopeDescriptor: scopeDescriptor,
        prefix: prefix,
        activatedManually: activatedManually
      });
    };

    AutocompleteManager.prototype.getSuggestionsFromProviders = function(options) {
      var providerPromises, providers, suggestionsPromise;
      providers = this.providerManager.providersForScopeDescriptor(options.scopeDescriptor);
      providerPromises = [];
      providers.forEach((function(_this) {
        return function(provider) {
          var apiIs20, apiVersion, getSuggestions, upgradedOptions;
          apiVersion = _this.providerManager.apiVersionForProvider(provider);
          apiIs20 = semver.satisfies(apiVersion, '>=2.0.0');
          if (apiIs20) {
            getSuggestions = provider.getSuggestions.bind(provider);
            upgradedOptions = options;
          } else {
            getSuggestions = provider.requestHandler.bind(provider);
            upgradedOptions = {
              editor: options.editor,
              prefix: options.prefix,
              bufferPosition: options.bufferPosition,
              position: options.bufferPosition,
              scope: options.scopeDescriptor,
              scopeChain: options.scopeDescriptor.getScopeChain(),
              buffer: options.editor.getBuffer(),
              cursor: options.editor.getLastCursor()
            };
          }
          return providerPromises.push(Promise.resolve(getSuggestions(upgradedOptions)).then(function(providerSuggestions) {
            var hasDeprecations, hasEmpty, suggestion, _i, _len;
            if (providerSuggestions == null) {
              return;
            }
            hasDeprecations = false;
            if (apiIs20 && providerSuggestions.length) {
              hasDeprecations = _this.deprecateForSuggestion(provider, providerSuggestions[0]);
            }
            if (hasDeprecations || !apiIs20) {
              providerSuggestions = providerSuggestions.map(function(suggestion) {
                var newSuggestion, _ref1, _ref2;
                newSuggestion = {
                  text: (_ref1 = suggestion.text) != null ? _ref1 : suggestion.word,
                  snippet: suggestion.snippet,
                  replacementPrefix: (_ref2 = suggestion.replacementPrefix) != null ? _ref2 : suggestion.prefix,
                  className: suggestion.className,
                  type: suggestion.type
                };
                if ((newSuggestion.rightLabelHTML == null) && suggestion.renderLabelAsHtml) {
                  newSuggestion.rightLabelHTML = suggestion.label;
                }
                if ((newSuggestion.rightLabel == null) && !suggestion.renderLabelAsHtml) {
                  newSuggestion.rightLabel = suggestion.label;
                }
                return newSuggestion;
              });
            }
            hasEmpty = false;
            for (_i = 0, _len = providerSuggestions.length; _i < _len; _i++) {
              suggestion = providerSuggestions[_i];
              if (!(suggestion.snippet || suggestion.text)) {
                hasEmpty = true;
              }
              if (suggestion.replacementPrefix == null) {
                suggestion.replacementPrefix = _this.getDefaultReplacementPrefix(options.prefix);
              }
              suggestion.provider = provider;
            }
            if (hasEmpty) {
              providerSuggestions = (function() {
                var _j, _len1, _results;
                _results = [];
                for (_j = 0, _len1 = providerSuggestions.length; _j < _len1; _j++) {
                  suggestion = providerSuggestions[_j];
                  if (suggestion.snippet || suggestion.text) {
                    _results.push(suggestion);
                  }
                }
                return _results;
              })();
            }
            if (provider.filterSuggestions) {
              providerSuggestions = _this.filterSuggestions(providerSuggestions, options);
            }
            return providerSuggestions;
          }));
        };
      })(this));
      if (!(providerPromises != null ? providerPromises.length : void 0)) {
        return;
      }
      return this.currentSuggestionsPromise = suggestionsPromise = Promise.all(providerPromises).then(this.mergeSuggestionsFromProviders).then((function(_this) {
        return function(suggestions) {
          if (_this.currentSuggestionsPromise !== suggestionsPromise) {
            return;
          }
          if (options.activatedManually && _this.shouldDisplaySuggestions && suggestions.length === 1) {
            return _this.confirm(suggestions[0]);
          } else {
            return _this.displaySuggestions(suggestions, options);
          }
        };
      })(this));
    };

    AutocompleteManager.prototype.filterSuggestions = function(suggestions, _arg) {
      var firstCharIsMatch, i, prefix, prefixIsEmpty, results, score, suggestion, suggestionPrefix, text, _i, _len, _ref1;
      prefix = _arg.prefix;
      results = [];
      for (i = _i = 0, _len = suggestions.length; _i < _len; i = ++_i) {
        suggestion = suggestions[i];
        suggestion.sortScore = Math.max(-i / 10 + 3, 0) + 1;
        suggestion.score = null;
        text = suggestion.snippet || suggestion.text;
        suggestionPrefix = (_ref1 = suggestion.replacementPrefix) != null ? _ref1 : prefix;
        prefixIsEmpty = !suggestionPrefix || suggestionPrefix === ' ';
        firstCharIsMatch = !prefixIsEmpty && suggestionPrefix[0].toLowerCase() === text[0].toLowerCase();
        if (prefixIsEmpty) {
          results.push(suggestion);
        }
        if (firstCharIsMatch && (score = fuzzaldrin.score(text, suggestionPrefix)) > 0) {
          suggestion.score = score * suggestion.sortScore;
          results.push(suggestion);
        }
      }
      results.sort(this.reverseSortOnScoreComparator);
      return results;
    };

    AutocompleteManager.prototype.reverseSortOnScoreComparator = function(a, b) {
      var _ref1, _ref2;
      return ((_ref1 = b.score) != null ? _ref1 : b.sortScore) - ((_ref2 = a.score) != null ? _ref2 : a.sortScore);
    };

    AutocompleteManager.prototype.mergeSuggestionsFromProviders = function(providerSuggestions) {
      return providerSuggestions.reduce(function(suggestions, providerSuggestions) {
        if (providerSuggestions != null ? providerSuggestions.length : void 0) {
          suggestions = suggestions.concat(providerSuggestions);
        }
        return suggestions;
      }, []);
    };

    AutocompleteManager.prototype.deprecateForSuggestion = function(provider, suggestion) {
      var hasDeprecations;
      hasDeprecations = false;
      if (suggestion.word != null) {
        hasDeprecations = true;
        if (grim == null) {
          grim = require('grim');
        }
        grim.deprecate("Autocomplete provider '" + provider.constructor.name + "(" + provider.id + ")'\nreturns suggestions with a `word` attribute.\nThe `word` attribute is now `text`.\nSee https://github.com/atom/autocomplete-plus/wiki/Provider-API");
      }
      if (suggestion.prefix != null) {
        hasDeprecations = true;
        if (grim == null) {
          grim = require('grim');
        }
        grim.deprecate("Autocomplete provider '" + provider.constructor.name + "(" + provider.id + ")'\nreturns suggestions with a `prefix` attribute.\nThe `prefix` attribute is now `replacementPrefix` and is optional.\nSee https://github.com/atom/autocomplete-plus/wiki/Provider-API");
      }
      if (suggestion.label != null) {
        hasDeprecations = true;
        if (grim == null) {
          grim = require('grim');
        }
        grim.deprecate("Autocomplete provider '" + provider.constructor.name + "(" + provider.id + ")'\nreturns suggestions with a `label` attribute.\nThe `label` attribute is now `rightLabel` or `rightLabelHTML`.\nSee https://github.com/atom/autocomplete-plus/wiki/Provider-API");
      }
      if (suggestion.onWillConfirm != null) {
        hasDeprecations = true;
        if (grim == null) {
          grim = require('grim');
        }
        grim.deprecate("Autocomplete provider '" + provider.constructor.name + "(" + provider.id + ")'\nreturns suggestions with a `onWillConfirm` callback.\nThe `onWillConfirm` callback is no longer supported.\nSee https://github.com/atom/autocomplete-plus/wiki/Provider-API");
      }
      if (suggestion.onDidConfirm != null) {
        hasDeprecations = true;
        if (grim == null) {
          grim = require('grim');
        }
        grim.deprecate("Autocomplete provider '" + provider.constructor.name + "(" + provider.id + ")'\nreturns suggestions with a `onDidConfirm` callback.\nThe `onDidConfirm` callback is now a `onDidInsertSuggestion` callback on the provider itself.\nSee https://github.com/atom/autocomplete-plus/wiki/Provider-API");
      }
      return hasDeprecations;
    };

    AutocompleteManager.prototype.displaySuggestions = function(suggestions, options) {
      suggestions = this.getUniqueSuggestions(suggestions);
      if ((suggestions != null ? suggestions.length : void 0) === 1 && (suggestions[0].snippet || suggestions[0].text) === options.prefix) {
        return this.hideSuggestionList();
      }
      if (this.shouldDisplaySuggestions && suggestions.length) {
        return this.showSuggestionList(suggestions, options);
      } else {
        return this.hideSuggestionList();
      }
    };

    AutocompleteManager.prototype.getUniqueSuggestions = function(suggestions) {
      var result, seen, suggestion, val, _i, _len;
      seen = {};
      result = [];
      for (_i = 0, _len = suggestions.length; _i < _len; _i++) {
        suggestion = suggestions[_i];
        val = suggestion.text + suggestion.snippet;
        if (!seen[val]) {
          result.push(suggestion);
          seen[val] = true;
        }
      }
      return result;
    };

    AutocompleteManager.prototype.getPrefix = function(editor, bufferPosition) {
      var line, _ref1;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      return ((_ref1 = this.prefixRegex.exec(line)) != null ? _ref1[2] : void 0) || '';
    };

    AutocompleteManager.prototype.getDefaultReplacementPrefix = function(prefix) {
      if (this.wordPrefixRegex.test(prefix)) {
        return prefix;
      } else {
        return '';
      }
    };

    AutocompleteManager.prototype.confirm = function(suggestion) {
      var apiIs20, apiVersion, triggerPosition, _base, _ref1;
      if (!((this.editor != null) && (suggestion != null) && !this.disposed)) {
        return;
      }
      apiVersion = this.providerManager.apiVersionForProvider(suggestion.provider);
      apiIs20 = semver.satisfies(apiVersion, '>=2.0.0');
      triggerPosition = this.editor.getLastCursor().getBufferPosition();
      if (typeof suggestion.onWillConfirm === "function") {
        suggestion.onWillConfirm();
      }
      if ((_ref1 = this.editor.getSelections()) != null) {
        _ref1.forEach(function(selection) {
          return selection != null ? selection.clear() : void 0;
        });
      }
      this.hideSuggestionList();
      this.replaceTextWithMatch(suggestion);
      if (apiIs20) {
        return typeof (_base = suggestion.provider).onDidInsertSuggestion === "function" ? _base.onDidInsertSuggestion({
          editor: this.editor,
          suggestion: suggestion,
          triggerPosition: triggerPosition
        }) : void 0;
      } else {
        return typeof suggestion.onDidConfirm === "function" ? suggestion.onDidConfirm() : void 0;
      }
    };

    AutocompleteManager.prototype.showSuggestionList = function(suggestions, options) {
      if (this.disposed) {
        return;
      }
      this.suggestionList.changeItems(suggestions);
      return this.suggestionList.show(this.editor, options);
    };

    AutocompleteManager.prototype.hideSuggestionList = function() {
      if (this.disposed) {
        return;
      }
      this.suggestionList.changeItems(null);
      this.suggestionList.hide();
      return this.shouldDisplaySuggestions = false;
    };

    AutocompleteManager.prototype.requestHideSuggestionList = function(command) {
      this.hideTimeout = setTimeout(this.hideSuggestionList, 0);
      return this.shouldDisplaySuggestions = false;
    };

    AutocompleteManager.prototype.cancelHideSuggestionListRequest = function() {
      return clearTimeout(this.hideTimeout);
    };

    AutocompleteManager.prototype.replaceTextWithMatch = function(suggestion) {
      var cursors, newSelectedBufferRanges;
      if (this.editor == null) {
        return;
      }
      newSelectedBufferRanges = [];
      cursors = this.editor.getCursors();
      if (cursors == null) {
        return;
      }
      return this.editor.transact((function(_this) {
        return function() {
          var beginningPosition, cursor, endPosition, suffix, _i, _len, _ref1;
          for (_i = 0, _len = cursors.length; _i < _len; _i++) {
            cursor = cursors[_i];
            endPosition = cursor.getBufferPosition();
            beginningPosition = [endPosition.row, endPosition.column - suggestion.replacementPrefix.length];
            if (_this.editor.getTextInBufferRange([beginningPosition, endPosition]) === suggestion.replacementPrefix) {
              suffix = _this.getSuffix(_this.editor, endPosition, suggestion);
              if (suffix.length) {
                cursor.moveRight(suffix.length);
              }
              cursor.selection.selectLeft(suggestion.replacementPrefix.length + suffix.length);
              if ((suggestion.snippet != null) && (_this.snippetsManager != null)) {
                _this.snippetsManager.insertSnippet(suggestion.snippet, _this.editor, cursor);
              } else {
                cursor.selection.insertText((_ref1 = suggestion.text) != null ? _ref1 : suggestion.snippet);
              }
            }
          }
        };
      })(this));
    };

    AutocompleteManager.prototype.getSuffix = function(editor, bufferPosition, suggestion) {
      var endOfLineText, endPosition, suffix, _ref1;
      suffix = (_ref1 = suggestion.snippet) != null ? _ref1 : suggestion.text;
      endPosition = [bufferPosition.row, bufferPosition.column + suffix.length];
      endOfLineText = editor.getTextInBufferRange([bufferPosition, endPosition]);
      while (suffix) {
        if (endOfLineText.startsWith(suffix)) {
          return suffix;
        }
        suffix = suffix.slice(1);
      }
      return '';
    };

    AutocompleteManager.prototype.isCurrentFileBlackListed = function() {
      var blacklistGlob, fileName, _i, _len, _ref1;
      if (this.isCurrentFileBlackListedCache != null) {
        return this.isCurrentFileBlackListedCache;
      }
      if ((this.fileBlacklist == null) || this.fileBlacklist.length === 0) {
        this.isCurrentFileBlackListedCache = false;
        return this.isCurrentFileBlackListedCache;
      }
      if (minimatch == null) {
        minimatch = require('minimatch');
      }
      fileName = path.basename(this.buffer.getPath());
      _ref1 = this.fileBlacklist;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        blacklistGlob = _ref1[_i];
        if (minimatch(fileName, blacklistGlob)) {
          this.isCurrentFileBlackListedCache = true;
          return this.isCurrentFileBlackListedCache;
        }
      }
      return this.isCurrentFileBlackListedCache = false;
    };

    AutocompleteManager.prototype.requestNewSuggestions = function() {
      var delay;
      delay = atom.config.get('autocomplete-plus.autoActivationDelay');
      clearTimeout(this.delayTimeout);
      if (this.suggestionList.isActive()) {
        delay = this.suggestionDelay;
      }
      this.delayTimeout = setTimeout(this.findSuggestions, delay);
      return this.shouldDisplaySuggestions = true;
    };

    AutocompleteManager.prototype.cancelNewSuggestionsRequest = function() {
      clearTimeout(this.delayTimeout);
      return this.shouldDisplaySuggestions = false;
    };

    AutocompleteManager.prototype.cursorMoved = function(_arg) {
      var textChanged;
      textChanged = _arg.textChanged;
      if (!textChanged) {
        return this.requestHideSuggestionList();
      }
    };

    AutocompleteManager.prototype.bufferSaved = function() {
      if (!this.autosaveEnabled) {
        return this.hideSuggestionList();
      }
    };

    AutocompleteManager.prototype.bufferChanged = function(_arg) {
      var cursorPositions, newRange, newText, oldRange, oldText, shouldActivate;
      newText = _arg.newText, newRange = _arg.newRange, oldText = _arg.oldText, oldRange = _arg.oldRange;
      if (this.disposed) {
        return;
      }
      if (this.compositionInProgress) {
        return this.hideSuggestionList();
      }
      shouldActivate = false;
      cursorPositions = this.editor.getCursorBufferPositions();
      if (this.autoActivationEnabled || this.suggestionList.isActive()) {
        if (newText.length > 0) {
          shouldActivate = (cursorPositions.some(function(position) {
            return newRange.containsPoint(position);
          })) && (newText === ' ' || newText.trim().length === 1 || __indexOf.call(this.bracketMatcherPairs, newText) >= 0);
        } else if (oldText.length > 0) {
          shouldActivate = (this.backspaceTriggersAutocomplete || this.suggestionList.isActive()) && (cursorPositions.some(function(position) {
            return newRange.containsPoint(position);
          })) && (oldText === ' ' || oldText.trim().length === 1 || __indexOf.call(this.bracketMatcherPairs, oldText) >= 0);
        }
        if (shouldActivate && this.shouldSuppressActivationForEditorClasses()) {
          shouldActivate = false;
        }
      }
      if (shouldActivate) {
        this.cancelHideSuggestionListRequest();
        return this.requestNewSuggestions();
      } else {
        this.cancelNewSuggestionsRequest();
        return this.hideSuggestionList();
      }
    };

    AutocompleteManager.prototype.shouldSuppressActivationForEditorClasses = function() {
      var className, classNames, containsCount, _i, _j, _len, _len1, _ref1;
      _ref1 = this.suppressForClasses;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        classNames = _ref1[_i];
        containsCount = 0;
        for (_j = 0, _len1 = classNames.length; _j < _len1; _j++) {
          className = classNames[_j];
          if (this.editorView.classList.contains(className)) {
            containsCount += 1;
          }
        }
        if (containsCount === classNames.length) {
          return true;
        }
      }
      return false;
    };

    AutocompleteManager.prototype.dispose = function() {
      var _ref1, _ref2;
      this.hideSuggestionList();
      this.disposed = true;
      this.ready = false;
      if ((_ref1 = this.editorSubscriptions) != null) {
        _ref1.dispose();
      }
      this.editorSubscriptions = null;
      if ((_ref2 = this.subscriptions) != null) {
        _ref2.dispose();
      }
      this.subscriptions = null;
      this.suggestionList = null;
      return this.providerManager = null;
    };

    return AutocompleteManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdMQUFBO0lBQUE7eUpBQUE7O0FBQUEsRUFBQSxPQUF3RCxPQUFBLENBQVEsTUFBUixDQUF4RCxFQUFDLGFBQUEsS0FBRCxFQUFRLGtCQUFBLFVBQVIsRUFBb0IsMkJBQUEsbUJBQXBCLEVBQXlDLGtCQUFBLFVBQXpDLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBRlQsQ0FBQTs7QUFBQSxFQUdBLFVBQUEsR0FBYSxPQUFBLENBQVEsWUFBUixDQUhiLENBQUE7O0FBQUEsRUFLQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUixDQUxsQixDQUFBOztBQUFBLEVBTUEsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVIsQ0FOakIsQ0FBQTs7QUFBQSxFQU9BLHFCQUFBLEdBQXdCLE9BQUEsQ0FBUSwyQkFBUixDQVB4QixDQUFBOztBQUFBLEVBVUEsU0FBQSxHQUFZLElBVlosQ0FBQTs7QUFBQSxFQVdBLElBQUEsR0FBTyxJQVhQLENBQUE7O0FBQUEsRUFhQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osa0NBQUEsZUFBQSxHQUFpQixLQUFqQixDQUFBOztBQUFBLGtDQUNBLDZCQUFBLEdBQStCLElBRC9CLENBQUE7O0FBQUEsa0NBRUEsbUJBQUEsR0FBcUIsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUIsSUFBekIsRUFBK0IsSUFBL0IsRUFBcUMsSUFBckMsRUFBMkMsSUFBM0MsRUFBaUQsSUFBakQsRUFBdUQsSUFBdkQsQ0FGckIsQ0FBQTs7QUFBQSxrQ0FHQSxNQUFBLEdBQVEsSUFIUixDQUFBOztBQUFBLGtDQUlBLHFCQUFBLEdB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
//# sourceURL=/home/andrei/dotfiles/atom/packages/autocomplete-plus/lib/autocomplete-manager.coffee