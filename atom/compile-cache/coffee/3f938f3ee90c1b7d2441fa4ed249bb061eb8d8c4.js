(function() {
  var CompositeDisposable, Emitter, SuggestionList, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ref = require('atom'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  module.exports = SuggestionList = (function() {
    SuggestionList.prototype.wordPrefixRegex = /^[\w-]/;

    function SuggestionList() {
      this.destroyOverlay = __bind(this.destroyOverlay, this);
      this.hide = __bind(this.hide, this);
      this.showAtCursorPosition = __bind(this.showAtCursorPosition, this);
      this.showAtBeginningOfPrefix = __bind(this.showAtBeginningOfPrefix, this);
      this.show = __bind(this.show, this);
      this.confirmSelection = __bind(this.confirmSelection, this);
      this.confirm = __bind(this.confirm, this);
      this.cancel = __bind(this.cancel, this);
      this.active = false;
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-text-editor.autocomplete-active', {
        'autocomplete-plus:confirm': this.confirmSelection,
        'autocomplete-plus:cancel': this.cancel
      }));
      this.subscriptions.add(atom.config.observe('autocomplete-plus.useCoreMovementCommands', (function(_this) {
        return function() {
          return _this.bindToMovementCommands();
        };
      })(this)));
    }

    SuggestionList.prototype.bindToMovementCommands = function() {
      var commandNamespace, commands, useCoreMovementCommands, _ref1;
      useCoreMovementCommands = atom.config.get('autocomplete-plus.useCoreMovementCommands');
      commandNamespace = useCoreMovementCommands ? 'core' : 'autocomplete-plus';
      commands = {};
      commands["" + commandNamespace + ":move-up"] = (function(_this) {
        return function(event) {
          var _ref1;
          if (_this.isActive() && ((_ref1 = _this.items) != null ? _ref1.length : void 0) > 1) {
            _this.selectPrevious();
            return event.stopImmediatePropagation();
          }
        };
      })(this);
      commands["" + commandNamespace + ":move-down"] = (function(_this) {
        return function(event) {
          var _ref1;
          if (_this.isActive() && ((_ref1 = _this.items) != null ? _ref1.length : void 0) > 1) {
            _this.selectNext();
            return event.stopImmediatePropagation();
          }
        };
      })(this);
      commands["" + commandNamespace + ":page-up"] = (function(_this) {
        return function(event) {
          var _ref1;
          if (_this.isActive() && ((_ref1 = _this.items) != null ? _ref1.length : void 0) > 1) {
            _this.selectPageUp();
            return event.stopImmediatePropagation();
          }
        };
      })(this);
      commands["" + commandNamespace + ":page-down"] = (function(_this) {
        return function(event) {
          var _ref1;
          if (_this.isActive() && ((_ref1 = _this.items) != null ? _ref1.length : void 0) > 1) {
            _this.selectPageDown();
            return event.stopImmediatePropagation();
          }
        };
      })(this);
      commands["" + commandNamespace + ":move-to-top"] = (function(_this) {
        return function(event) {
          var _ref1;
          if (_this.isActive() && ((_ref1 = _this.items) != null ? _ref1.length : void 0) > 1) {
            _this.selectTop();
            return event.stopImmediatePropagation();
          }
        };
      })(this);
      commands["" + commandNamespace + ":move-to-bottom"] = (function(_this) {
        return function(event) {
          var _ref1;
          if (_this.isActive() && ((_ref1 = _this.items) != null ? _ref1.length : void 0) > 1) {
            _this.selectBottom();
            return event.stopImmediatePropagation();
          }
        };
      })(this);
      if ((_ref1 = this.movementCommandSubscriptions) != null) {
        _ref1.dispose();
      }
      this.movementCommandSubscriptions = new CompositeDisposable;
      return this.movementCommandSubscriptions.add(atom.commands.add('atom-text-editor.autocomplete-active', commands));
    };

    SuggestionList.prototype.addKeyboardInteraction = function() {
      var completionKey, keys;
      this.removeKeyboardInteraction();
      completionKey = atom.config.get('autocomplete-plus.confirmCompletion') || '';
      keys = {};
      if (completionKey.indexOf('tab') > -1) {
        keys['tab'] = 'autocomplete-plus:confirm';
      }
      if (completionKey.indexOf('enter') > -1) {
        keys['enter'] = 'autocomplete-plus:confirm';
      }
      this.keymaps = atom.keymaps.add('atom-text-editor.autocomplete-active', {
        'atom-text-editor.autocomplete-active': keys
      });
      return this.subscriptions.add(this.keymaps);
    };

    SuggestionList.prototype.removeKeyboardInteraction = function() {
      var _ref1;
      if ((_ref1 = this.keymaps) != null) {
        _ref1.dispose();
      }
      this.keymaps = null;
      return this.subscriptions.remove(this.keymaps);
    };


    /*
    Section: Event Triggers
     */

    SuggestionList.prototype.cancel = function() {
      return this.emitter.emit('did-cancel');
    };

    SuggestionList.prototype.confirm = function(match) {
      return this.emitter.emit('did-confirm', match);
    };

    SuggestionList.prototype.confirmSelection = function() {
      return this.emitter.emit('did-confirm-selection');
    };

    SuggestionList.prototype.selectNext = function() {
      return this.emitter.emit('did-select-next');
    };

    SuggestionList.prototype.selectPrevious = function() {
      return this.emitter.emit('did-select-previous');
    };

    SuggestionList.prototype.selectPageUp = function() {
      return this.emitter.emit('did-select-page-up');
    };

    SuggestionList.prototype.selectPageDown = function() {
      return this.emitter.emit('did-select-page-down');
    };

    SuggestionList.prototype.selectTop = function() {
      return this.emitter.emit('did-select-top');
    };

    SuggestionList.prototype.selectBottom = function() {
      return this.emitter.emit('did-select-bottom');
    };


    /*
    Section: Events
     */

    SuggestionList.prototype.onDidConfirmSelection = function(fn) {
      return this.emitter.on('did-confirm-selection', fn);
    };

    SuggestionList.prototype.onDidConfirm = function(fn) {
      return this.emitter.on('did-confirm', fn);
    };

    SuggestionList.prototype.onDidSelectNext = function(fn) {
      return this.emitter.on('did-select-next', fn);
    };

    SuggestionList.prototype.onDidSelectPrevious = function(fn) {
      return this.emitter.on('did-select-previous', fn);
    };

    SuggestionList.prototype.onDidSelectPageUp = function(fn) {
      return this.emitter.on('did-select-page-up', fn);
    };

    SuggestionList.prototype.onDidSelectPageDown = function(fn) {
      return this.emitter.on('did-select-page-down', fn);
    };

    SuggestionList.prototype.onDidSelectTop = function(fn) {
      return this.emitter.on('did-select-top', fn);
    };

    SuggestionList.prototype.onDidSelectBottom = function(fn) {
      return this.emitter.on('did-select-bottom', fn);
    };

    SuggestionList.prototype.onDidCancel = function(fn) {
      return this.emitter.on('did-cancel', fn);
    };

    SuggestionList.prototype.onDidDispose = function(fn) {
      return this.emitter.on('did-dispose', fn);
    };

    SuggestionList.prototype.onDidChangeItems = function(fn) {
      return this.emitter.on('did-change-items', fn);
    };

    SuggestionList.prototype.isActive = function() {
      return this.active;
    };

    SuggestionList.prototype.show = function(editor, options) {
      var followRawPrefix, item, prefix, _i, _len, _ref1;
      if (atom.config.get('autocomplete-plus.suggestionListFollows') === 'Cursor') {
        return this.showAtCursorPosition(editor, options);
      } else {
        prefix = options.prefix;
        followRawPrefix = false;
        _ref1 = this.items;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          item = _ref1[_i];
          if (item.replacementPrefix != null) {
            prefix = item.replacementPrefix.trim();
            followRawPrefix = true;
            break;
          }
        }
        return this.showAtBeginningOfPrefix(editor, prefix, followRawPrefix);
      }
    };

    SuggestionList.prototype.showAtBeginningOfPrefix = function(editor, prefix, followRawPrefix) {
      var bufferPosition, marker, _ref1;
      if (followRawPrefix == null) {
        followRawPrefix = false;
      }
      if (editor == null) {
        return;
      }
      bufferPosition = editor.getCursorBufferPosition();
      if (followRawPrefix || this.wordPrefixRegex.test(prefix)) {
        bufferPosition = bufferPosition.translate([0, -prefix.length]);
      }
      if (this.active) {
        if (!bufferPosition.isEqual(this.displayBufferPosition)) {
          this.displayBufferPosition = bufferPosition;
          return (_ref1 = this.suggestionMarker) != null ? _ref1.setBufferRange([bufferPosition, bufferPosition]) : void 0;
        }
      } else {
        this.destroyOverlay();
        this.displayBufferPosition = bufferPosition;
        marker = this.suggestionMarker = editor.markBufferRange([bufferPosition, bufferPosition]);
        this.overlayDecoration = editor.decorateMarker(marker, {
          type: 'overlay',
          item: this,
          position: 'tail'
        });
        this.addKeyboardInteraction();
        return this.active = true;
      }
    };

    SuggestionList.prototype.showAtCursorPosition = function(editor) {
      var marker, _ref1;
      if (this.active || (editor == null)) {
        return;
      }
      this.destroyOverlay();
      if (marker = (_ref1 = editor.getLastCursor()) != null ? _ref1.getMarker() : void 0) {
        this.overlayDecoration = editor.decorateMarker(marker, {
          type: 'overlay',
          item: this
        });
        this.addKeyboardInteraction();
        return this.active = true;
      }
    };

    SuggestionList.prototype.hide = function() {
      if (!this.active) {
        return;
      }
      this.destroyOverlay();
      this.removeKeyboardInteraction();
      return this.active = false;
    };

    SuggestionList.prototype.destroyOverlay = function() {
      var _ref1;
      if (this.suggestionMarker != null) {
        this.suggestionMarker.destroy();
      } else {
        if ((_ref1 = this.overlayDecoration) != null) {
          _ref1.destroy();
        }
      }
      this.suggestionMarker = void 0;
      return this.overlayDecoration = void 0;
    };

    SuggestionList.prototype.changeItems = function(items) {
      this.items = items;
      return this.emitter.emit('did-change-items', items);
    };

    SuggestionList.prototype.dispose = function() {
      var _ref1;
      this.subscriptions.dispose();
      if ((_ref1 = this.movementCommandSubscriptions) != null) {
        _ref1.dispose();
      }
      this.emitter.emit('did-dispose');
      return this.emitter.dispose();
    };

    return SuggestionList;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtEQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxPQUFpQyxPQUFBLENBQVEsTUFBUixDQUFqQyxFQUFDLGVBQUEsT0FBRCxFQUFVLDJCQUFBLG1CQUFWLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osNkJBQUEsZUFBQSxHQUFpQixRQUFqQixDQUFBOztBQUVhLElBQUEsd0JBQUEsR0FBQTtBQUNYLDZEQUFBLENBQUE7QUFBQSx5Q0FBQSxDQUFBO0FBQUEseUVBQUEsQ0FBQTtBQUFBLCtFQUFBLENBQUE7QUFBQSx5Q0FBQSxDQUFBO0FBQUEsaUVBQUEsQ0FBQTtBQUFBLCtDQUFBLENBQUE7QUFBQSw2Q0FBQSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLEtBQVYsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FEWCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBRmpCLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isc0NBQWxCLEVBQ2pCO0FBQUEsUUFBQSwyQkFBQSxFQUE2QixJQUFDLENBQUEsZ0JBQTlCO0FBQUEsUUFDQSwwQkFBQSxFQUE0QixJQUFDLENBQUEsTUFEN0I7T0FEaUIsQ0FBbkIsQ0FIQSxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLDJDQUFwQixFQUFpRSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxzQkFBRCxD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
//# sourceURL=/home/andrei/dotfiles/atom/packages/autocomplete-plus/lib/suggestion-list.coffee