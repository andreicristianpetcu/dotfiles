(function() {
  var RefCountedTokenList, Symbol, SymbolStore, binaryIndexOf, getObjectLength, selectorsMatchScopeChain,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  RefCountedTokenList = require('./ref-counted-token-list');

  selectorsMatchScopeChain = require('./scope-helpers').selectorsMatchScopeChain;

  Symbol = (function() {
    Symbol.prototype.count = 0;

    Symbol.prototype.metadataByPath = null;

    Symbol.prototype.cachedConfig = null;

    Symbol.prototype.type = null;

    function Symbol(text) {
      this.text = text;
      this.metadataByPath = new Map;
    }

    Symbol.prototype.getCount = function() {
      return this.count;
    };

    Symbol.prototype.bufferRowsForBuffer = function(buffer) {
      var _ref;
      return (_ref = this.metadataByPath.get(buffer)) != null ? _ref.bufferRows : void 0;
    };

    Symbol.prototype.countForBuffer = function(buffer) {
      var bufferCount, metadata, scopeChain, scopeCount, _ref;
      metadata = this.metadataByPath.get(buffer);
      bufferCount = 0;
      if (metadata != null) {
        _ref = metadata.scopeChains;
        for (scopeChain in _ref) {
          scopeCount = _ref[scopeChain];
          bufferCount += scopeCount;
        }
      }
      return bufferCount;
    };

    Symbol.prototype.clearForBuffer = function(buffer) {
      var bufferCount;
      bufferCount = this.countForBuffer(buffer);
      if (bufferCount > 0) {
        this.count -= bufferCount;
        return delete this.metadataByPath.get(buffer);
      }
    };

    Symbol.prototype.adjustBufferRows = function(buffer, adjustmentStartRow, adjustmentDelta) {
      var bufferRows, index, length, _ref;
      bufferRows = (_ref = this.metadataByPath.get(buffer)) != null ? _ref.bufferRows : void 0;
      if (bufferRows == null) {
        return;
      }
      index = binaryIndexOf(bufferRows, adjustmentStartRow);
      length = bufferRows.length;
      while (index < length) {
        bufferRows[index] += adjustmentDelta;
        index++;
      }
    };

    Symbol.prototype.addInstance = function(buffer, bufferRow, scopeChain) {
      var metadata;
      metadata = this.metadataByPath.get(buffer);
      if (metadata == null) {
        if (metadata == null) {
          metadata = {};
        }
        this.metadataByPath.set(buffer, metadata);
      }
      this.addBufferRow(buffer, bufferRow);
      if (metadata.scopeChains == null) {
        metadata.scopeChains = {};
      }
      if (metadata.scopeChains[scopeChain] == null) {
        this.type = null;
        metadata.scopeChains[scopeChain] = 0;
      }
      metadata.scopeChains[scopeChain] += 1;
      return this.count += 1;
    };

    Symbol.prototype.removeInstance = function(buffer, bufferRow, scopeChain) {
      var metadata;
      if (!(metadata = this.metadataByPath.get(buffer))) {
        return;
      }
      this.removeBufferRow(buffer, bufferRow);
      if (metadata.scopeChains[scopeChain] != null) {
        this.count -= 1;
        metadata.scopeChains[scopeChain] -= 1;
        if (metadata.scopeChains[scopeChain] === 0) {
          delete metadata.scopeChains[scopeChain];
          this.type = null;
        }
        if (getObjectLength(metadata.scopeChains) === 0) {
          return this.metadataByPath["delete"](buffer);
        }
      }
    };

    Symbol.prototype.addBufferRow = function(buffer, row) {
      var bufferRows, index, metadata;
      metadata = this.metadataByPath.get(buffer);
      if (metadata.bufferRows == null) {
        metadata.bufferRows = [];
      }
      bufferRows = metadata.bufferRows;
      index = binaryIndexOf(bufferRows, row);
      return bufferRows.splice(index, 0, row);
    };

    Symbol.prototype.removeBufferRow = function(buffer, row) {
      var bufferRows, index, metadata;
      metadata = this.metadataByPath.get(buffer);
      bufferRows = metadata.bufferRows;
      if (!bufferRows) {
        return;
      }
      index = binaryIndexOf(bufferRows, row);
      if (bufferRows[index] === row) {
        return bufferRows.splice(index, 1);
      }
    };

    Symbol.prototype.isEqualToWord = function(word) {
      return this.text === word;
    };

    Symbol.prototype.instancesForWord = function(word) {
      if (this.text === word) {
        return this.count;
      } else {
        return 0;
      }
    };

    Symbol.prototype.appliesToConfig = function(config, buffer) {
      var options, type, typePriority;
      if (this.cachedConfig !== config) {
        this.type = null;
      }
      if (this.type == null) {
        typePriority = 0;
        for (type in config) {
          options = config[type];
          if (options.selectors == null) {
            continue;
          }
          this.metadataByPath.forEach((function(_this) {
            return function(_arg) {
              var scopeChain, scopeChains, __, _results;
              scopeChains = _arg.scopeChains;
              _results = [];
              for (scopeChain in scopeChains) {
                __ = scopeChains[scopeChain];
                if ((!_this.type || options.typePriority > typePriority) && selectorsMatchScopeChain(options.selectors, scopeChain)) {
                  _this.type = type;
                  _results.push(typePriority = options.typePriority);
                } else {
                  _results.push(void 0);
                }
              }
              return _results;
            };
          })(this));
        }
        this.cachedConfig = config;
      }
      if (buffer != null) {
        return (this.type != null) && this.countForBuffer(buffer) > 0;
      } else {
        return this.type != null;
      }
    };

    return Symbol;

  })();

  module.exports = SymbolStore = (function() {
    SymbolStore.prototype.count = 0;

    function SymbolStore(wordRegex) {
      this.wordRegex = wordRegex;
      this.removeSymbol = __bind(this.removeSymbol, this);
      this.removeToken = __bind(this.removeToken, this);
      this.addToken = __bind(this.addToken, this);
      this.clear();
    }

    SymbolStore.prototype.clear = function(buffer) {
      var symbol, symbolKey, _ref;
      if (buffer != null) {
        _ref = this.symbolMap;
        for (symbolKey in _ref) {
          symbol = _ref[symbolKey];
          symbol.clearForBuffer(buffer);
          if (symbol.getCount() === 0) {
            delete this.symbolMap[symbolKey];
          }
        }
      } else {
        this.symbolMap = {};
      }
    };

    SymbolStore.prototype.getLength = function() {
      return this.count;
    };

    SymbolStore.prototype.getSymbol = function(symbolKey) {
      symbolKey = this.getKey(symbolKey);
      return this.symbolMap[symbolKey];
    };

    SymbolStore.prototype.symbolsForConfig = function(config, buffer, wordUnderCursor, numberOfCursors) {
      var options, symbol, symbolKey, symbols, type, _ref;
      symbols = [];
      _ref = this.symbolMap;
      for (symbolKey in _ref) {
        symbol = _ref[symbolKey];
        if (symbol.appliesToConfig(config, buffer) && (!symbol.isEqualToWord(wordUnderCursor) || symbol.instancesForWord(wordUnderCursor) > numberOfCursors)) {
          symbols.push(symbol);
        }
      }
      for (type in config) {
        options = config[type];
        if (options.suggestions) {
          symbols = symbols.concat(options.suggestions);
        }
      }
      return symbols;
    };

    SymbolStore.prototype.adjustBufferRows = function(editor, oldRange, newRange) {
      var adjustmentDelta, adjustmentStartRow, key, symbol, _ref;
      adjustmentStartRow = oldRange.end.row + 1;
      adjustmentDelta = newRange.getRowCount() - oldRange.getRowCount();
      if (adjustmentDelta === 0) {
        return;
      }
      _ref = this.symbolMap;
      for (key in _ref) {
        symbol = _ref[key];
        symbol.adjustBufferRows(editor.getBuffer(), adjustmentStartRow, adjustmentDelta);
      }
    };

    SymbolStore.prototype.addToken = function(text, scopeChain, buffer, bufferRow) {
      var matches, symbolText, _i, _len;
      matches = text.match(this.wordRegex);
      if (matches != null) {
        for (_i = 0, _len = matches.length; _i < _len; _i++) {
          symbolText = matches[_i];
          this.addSymbol(symbolText, buffer, bufferRow, scopeChain);
        }
      }
    };

    SymbolStore.prototype.removeToken = function(text, scopeChain, buffer, bufferRow) {
      var matches, symbolText, _i, _len;
      matches = text.match(this.wordRegex);
      if (matches != null) {
        for (_i = 0, _len = matches.length; _i < _len; _i++) {
          symbolText = matches[_i];
          this.removeSymbol(symbolText, buffer, bufferRow, scopeChain);
        }
      }
    };

    SymbolStore.prototype.addTokensInBufferRange = function(editor, bufferRange) {
      return this.operateOnTokensInBufferRange(editor, bufferRange, this.addToken);
    };

    SymbolStore.prototype.removeTokensInBufferRange = function(editor, bufferRange) {
      return this.operateOnTokensInBufferRange(editor, bufferRange, this.removeToken);
    };

    SymbolStore.prototype.operateOnTokensInBufferRange = function(editor, bufferRange, operatorFunc) {
      var bufferRow, iterator, token, tokenizedLine, tokenizedLines, useTokenIterator, _i, _j, _len, _ref, _ref1, _ref2;
      tokenizedLines = this.getTokenizedLines(editor);
      useTokenIterator = null;
      for (bufferRow = _i = _ref = bufferRange.start.row, _ref1 = bufferRange.end.row; _i <= _ref1; bufferRow = _i += 1) {
        tokenizedLine = tokenizedLines[bufferRow];
        if (tokenizedLine == null) {
          continue;
        }
        if (useTokenIterator == null) {
          useTokenIterator = typeof tokenizedLine.getTokenIterator === 'function';
        }
        if (useTokenIterator) {
          iterator = typeof tokenizedLine.getTokenIterator === "function" ? tokenizedLine.getTokenIterator() : void 0;
          while (iterator.next()) {
            operatorFunc(iterator.getText(), this.buildScopeChainString(iterator.getScopes()), editor.getBuffer(), bufferRow);
          }
        } else {
          _ref2 = tokenizedLine.tokens;
          for (_j = 0, _len = _ref2.length; _j < _len; _j++) {
            token = _ref2[_j];
            operatorFunc(token.value, this.buildScopeChainString(token.scopes), editor.getBuffer(), bufferRow);
          }
        }
      }
    };


    /*
    Private Methods
     */

    SymbolStore.prototype.addSymbol = function(symbolText, buffer, bufferRow, scopeChain) {
      var symbol, symbolKey;
      symbolKey = this.getKey(symbolText);
      symbol = this.symbolMap[symbolKey];
      if (symbol == null) {
        this.symbolMap[symbolKey] = symbol = new Symbol(symbolText);
        this.count += 1;
      }
      return symbol.addInstance(buffer, bufferRow, scopeChain);
    };

    SymbolStore.prototype.removeSymbol = function(symbolText, buffer, bufferRow, scopeChain) {
      var symbol, symbolKey;
      symbolKey = this.getKey(symbolText);
      symbol = this.symbolMap[symbolKey];
      if (symbol != null) {
        symbol.removeInstance(buffer, bufferRow, scopeChain);
        if (symbol.getCount() === 0) {
          delete this.symbolMap[symbolKey];
          return this.count -= 1;
        }
      }
    };

    SymbolStore.prototype.getTokenizedLines = function(editor) {
      return editor.displayBuffer.tokenizedBuffer.tokenizedLines;
    };

    SymbolStore.prototype.buildScopeChainString = function(scopes) {
      return '.' + scopes.join(' .');
    };

    SymbolStore.prototype.getKey = function(value) {
      return value + '$$';
    };

    return SymbolStore;

  })();

  getObjectLength = function(object) {
    var count, k, v;
    count = 0;
    for (k in object) {
      v = object[k];
      count += 1;
    }
    return count;
  };

  binaryIndexOf = function(array, searchElement) {
    var currentElement, currentIndex, maxIndex, minIndex;
    minIndex = 0;
    maxIndex = array.length - 1;
    while (minIndex <= maxIndex) {
      currentIndex = (minIndex + maxIndex) / 2 | 0;
      currentElement = array[currentIndex];
      if (currentElement < searchElement) {
        minIndex = currentIndex + 1;
      } else if (currentElement > searchElement) {
        maxIndex = currentIndex - 1;
      } else {
        return currentIndex;
      }
    }
    return minIndex;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtHQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxtQkFBQSxHQUFzQixPQUFBLENBQVEsMEJBQVIsQ0FBdEIsQ0FBQTs7QUFBQSxFQUNDLDJCQUE0QixPQUFBLENBQVEsaUJBQVIsRUFBNUIsd0JBREQsQ0FBQTs7QUFBQSxFQUdNO0FBQ0oscUJBQUEsS0FBQSxHQUFPLENBQVAsQ0FBQTs7QUFBQSxxQkFDQSxjQUFBLEdBQWdCLElBRGhCLENBQUE7O0FBQUEscUJBRUEsWUFBQSxHQUFjLElBRmQsQ0FBQTs7QUFBQSxxQkFJQSxJQUFBLEdBQU0sSUFKTixDQUFBOztBQU1hLElBQUEsZ0JBQUUsSUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsT0FBQSxJQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxjQUFELEdBQWtCLEdBQUEsQ0FBQSxHQUFsQixDQURXO0lBQUEsQ0FOYjs7QUFBQSxxQkFTQSxRQUFBLEdBQVUsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLE1BQUo7SUFBQSxDQVRWLENBQUE7O0FBQUEscUJBV0EsbUJBQUEsR0FBcUIsU0FBQyxNQUFELEdBQUE7QUFDbkIsVUFBQSxJQUFBO29FQUEyQixDQUFFLG9CQURWO0lBQUEsQ0FYckIsQ0FBQTs7QUFBQSxxQkFjQSxjQUFBLEdBQWdCLFNBQUMsTUFBRCxHQUFBO0FBQ2QsVUFBQSxtREFBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxjQUFjLENBQUMsR0FBaEIsQ0FBb0IsTUFBcEIsQ0FBWCxDQUFBO0FBQUEsTUFDQSxXQUFBLEdBQWMsQ0FEZCxDQUFBO0FBRUEsTUFBQSxJQUFHLGdCQUFIO0FBQ0U7QUFBQSxhQUFBLGtCQUFBO3dDQUFBO0FBQUEsVUFBQSxXQUFBLElBQWUsVUFBZixDQUFBO0FBQUEsU0FE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
//# sourceURL=/home/andrei/dotfiles/atom/packages/autocomplete-plus/lib/symbol-store.coffee