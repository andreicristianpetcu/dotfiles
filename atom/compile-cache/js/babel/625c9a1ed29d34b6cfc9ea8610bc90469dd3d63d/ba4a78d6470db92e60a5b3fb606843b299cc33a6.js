'use babel';

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _require = require('nuclide-analytics');

var trackTiming = _require.trackTiming;

var ClickToSymbol = (function () {

  /**
   * Promise that `findDelegateAndClickableRanges` resolves to a
   * {delegate: ClickToSymbolDelegate; clickableRanges: ?array<Range>} or null
   * if no delegate can handle click to given position.
   */

  function ClickToSymbol(textEditor, shouldUseCmdKeyToActivate, findClickableRangesAndCallback) {
    _classCallCheck(this, ClickToSymbol);

    this.editorView = atom.views.getView(textEditor);
    this._findClickableRangesAndCallback = findClickableRangesAndCallback;
    this.shouldUseCmdKeyToActivate = shouldUseCmdKeyToActivate;
    this.symbolNavigationMarkers = null;

    this.editor = textEditor;

    this.onMouseDown = this.onMouseDown.bind(this);
    this.editorView.addEventListener('mousedown', this.onMouseDown);

    this.onMouseMove = this.onMouseMove.bind(this);
    this.editorView.addEventListener('mousemove', this.onMouseMove);
  }

  _createDecoratedClass(ClickToSymbol, [{
    key: 'findClickableRangesAndCallback',
    decorators: [trackTiming()],
    value: function findClickableRangesAndCallback() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return this._findClickableRangesAndCallback.apply(this, args);
    }
  }, {
    key: 'onMouseDown',
    value: _asyncToGenerator(function* (e) {
      var active = this.shouldUseCmdKeyToActivate() ? e.metaKey : e.altKey;
      if (!active) {
        return;
      }
      // By default atom's text editor will try to add another
      // cursor on the screen with meta+click. If we're hijacking the
      // meta key, disable this behavior.
      if (this.shouldUseCmdKeyToActivate()) {
        e.stopPropagation();
      }

      var rowAndColumn = this.getRowAndColumnForMouseEvent(e);
      var clickableRangesAndCallback = yield this.findClickableRangesAndCallback(this.editor, rowAndColumn.row, rowAndColumn.column, e.shiftKey);
      if (clickableRangesAndCallback) {
        clickableRangesAndCallback.callback();
      }
    })
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      var _this = this;

      var active = this.shouldUseCmdKeyToActivate() ? e.metaKey : e.altKey;
      if (!active) {
        if (this.symbolNavigationMarkers) {
          this.updateSymbolNavigationMarkers(null);
        }
        return;
      }

      var rowAndColumn = this.getRowAndColumnForMouseEvent(e);
      this.findClickableRangesAndCallback(this.editor, rowAndColumn.row, rowAndColumn.column).then(function (clickableRangesAndCallback) {
        var clickableRanges = clickableRangesAndCallback ? clickableRangesAndCallback.clickableRanges : null;
        _this.updateSymbolNavigationMarkers(clickableRanges);
      });
    }
  }, {
    key: 'getRowAndColumnForMouseEvent',
    value: function getRowAndColumnForMouseEvent(e) {
      // component.screenPositionForMouseEvent is an undocumented method but it
      // may become public. See discussion at https://github.com/atom/atom/issues/7082.
      // TODO (t7337039) Convert to the public method if it becomes public.
      var screenPosition = this.editorView.component.screenPositionForMouseEvent(e);
      return this.editor.bufferPositionForScreenPosition(screenPosition);
    }

    // range may be null. If null, the marker will be cleared.
  }, {
    key: 'updateSymbolNavigationMarkers',
    value: function updateSymbolNavigationMarkers(ranges) {
      var _this2 = this;

      // Clear the existing marker, if appropriate.
      // TODO(mbolin): This marker needs to be removed more aggressively, like when
      // the user releases the alt key. Note that the symbol-navigation CSS class
      // will also have to be removed, though we do that via toggleClass() at the
      // end of this method to limit how much we touch the DOM.
      if (this.symbolNavigationMarkers) {
        this.symbolNavigationMarkers.forEach(function (symbolNavigationMarker) {
          symbolNavigationMarker.destroy();
        });
        this.symbolNavigationMarker = null;
      }

      if (ranges) {
        this.symbolNavigationMarkers = ranges.map(function (range) {
          var marker = _this2.editor.markBufferRange(range, { invalidate: 'never' });
          _this2.editor.decorateMarker(marker, { type: 'highlight', 'class': 'symbol-navigation' });
          return marker;
        });
      }
      this.editorView.classList.toggle('symbol-navigation', !!ranges);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.editorView.removeEventListener('mousedown', this.onMouseDown);
      this.editorView.removeEventListener('mousemove', this.onMouseMove);
    }
  }]);

  return ClickToSymbol;
})();

;

module.exports = ClickToSymbol;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FuZHJlaS9kb3RmaWxlcy9hdG9tL3BhY2thZ2VzL251Y2xpZGUtY2xpY2stdG8tc3ltYm9sL2xpYi9DbGlja1RvU3ltYm9sLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztlQVdRLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQzs7SUFBM0MsV0FBVyxZQUFYLFdBQVc7O0lBRVYsYUFBYTs7Ozs7Ozs7QUFRTixXQVJQLGFBQWEsQ0FTYixVQUFzQixFQUN0Qix5QkFBd0MsRUFDeEMsOEJBQWdILEVBQUU7MEJBWGxILGFBQWE7O0FBWWYsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNqRCxRQUFJLENBQUMsK0JBQStCLEdBQUcsOEJBQThCLENBQUM7QUFDdEUsUUFBSSxDQUFDLHlCQUF5QixHQUFHLHlCQUF5QixDQUFDO0FBQzNELFFBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUM7O0FBRXBDLFFBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDOztBQUV6QixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9DLFFBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFaEUsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQyxRQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7R0FDakU7O3dCQXhCRyxhQUFhOztpQkEwQmhCLFdBQVcsRUFBRTtXQUNnQiwwQ0FBbUI7d0NBQWYsSUFBSTtBQUFKLFlBQUk7OztBQUNwQyxhQUFPLElB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QUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ2pFOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNuRSxVQUFJLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDcEU7OztTQTlHRyxhQUFhOzs7QUErR2xCLENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMiLCJmaWxlIjoiL2hvbWUvYW5kcmVpL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvbnVjbGlkZS1jbGljay10by1zeW1ib2wvbGliL0NsaWNrVG9TeW1ib2wuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbi8qIEBmbG93ICovXG5cbi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG52YXIge3RyYWNrVGltaW5nfSA9IHJlcXVpcmUoJ251Y2xpZGUtYW5hbHl0aWNzJyk7XG5cbmNsYXNzIENsaWNrVG9TeW1ib2wge1xuICBzeW1ib2xOYXZpZ2F0aW9uTWFya2VyczogP2FycmF5PERpc3BsYXlCdWZmZXJNYXJrZXI+O1xuXG4gIC8qKlxuICAgKiBQcm9taXNlIHRoYXQgYGZpbmREZWxlZ2F0ZUFuZENsaWNrYWJsZVJhbmdlc2AgcmVzb2x2ZXMgdG8gYVxuICAgKiB7ZGVsZWdhdGU6IENsaWNrVG9TeW1ib2xEZWxlZ2F0ZTsgY2xpY2thYmxlUmFuZ2VzOiA/YXJyYXk8UmFuZ2U+fSBvciBudWxsXG4gICAqIGlmIG5vIGRlbGVnYXRlIGNhbiBoYW5kbGUgY2xpY2sgdG8gZ2l2ZW4gcG9zaXRpb24uXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHRleHRFZGl0b3I6IFRleHRFZGl0b3IsXG4gICAgICBzaG91bGRVc2VDbWRLZXlUb0FjdGl2YXRlOiAoKSA9PiBib29sZWFuLFxuICAgICAgZmluZENsaWNrYWJsZVJhbmdlc0FuZENhbGxiYWNrOiA/KGVkaXRvcjogVGV4dEVkaXRvciwgcm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBzaGlmdEtleTogYm9vbGVhbikgPT4gUHJvbWlzZSkge1xuICAgIHRoaXMuZWRpdG9yVmlldyA9IGF0b20udmlld3MuZ2V0Vmlldyh0ZXh0RWRpdG9yKTtcbiAgICB0aGlzLl9maW5kQ2xpY2thYmxlUmFuZ2VzQW5kQ2FsbGJhY2sgPSBmaW5kQ2xpY2thYmxlUmFuZ2VzQW5kQ2FsbGJhY2s7XG4gICAgdGhpcy5zaG91bGRVc2VDbWRLZXlUb0FjdGl2YXRlID0gc2hvdWxkVXNlQ21kS2V5VG9BY3RpdmF0ZTtcbiAgICB0aGlzLnN5bWJvbE5hdmlnYXRpb25NYXJrZXJzID0gbnVsbDtcblxuICAgIHRoaXMuZWRpdG9yID0gdGV4dEVkaXRvcjtcblxuICAgIHRoaXMub25Nb3VzZURvd24gPSB0aGlzLm9uTW91c2VEb3duLmJpbmQodGhpcyk7XG4gICAgdGhpcy5lZGl0b3JWaWV3LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMub25Nb3VzZURvd24pO1xuXG4gICAgdGhpcy5vbk1vdXNlTW92ZSA9IHRoaXMub25Nb3VzZU1vdmUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmVkaXRvclZpZXcuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5vbk1vdXNlTW92ZSk7XG4gIH1cblxuICBAdHJhY2tUaW1pbmcoKVxuICBmaW5kQ2xpY2thYmxlUmFuZ2VzQW5kQ2FsbGJhY2soLi4uYXJncyk6IFByb21pc2Uge1xuICAgIHJldHVybiB0aGlzLl9maW5kQ2xpY2thYmxlUmFuZ2VzQW5kQ2FsbGJhY2suYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICBhc3luYyBvbk1vdXNlRG93bihlOiBNb3VzZUV2ZW50KSB7XG4gICAgdmFyIGFjdGl2ZSA9IHRoaXMuc2hvdWxkVXNlQ21kS2V5VG9BY3RpdmF0ZSgpID8gZS5tZXRhS2V5IDogZS5hbHRLZXk7XG4gICAgaWYgKCFhY3RpdmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gQnkgZGVmYXVsdCBhdG9tJ3MgdGV4dCBlZGl0b3Igd2lsbCB0cnkgdG8gYWRkIGFub3RoZXJcbiAgICAvLyBjdXJzb3Igb24gdGhlIHNjcmVlbiB3aXRoIG1ldGErY2xpY2suIElmIHdlJ3JlIGhpamFja2luZyB0aGVcbiAgICAvLyBtZXRhIGtleSwgZGlzYWJsZSB0aGlzIGJlaGF2aW9yLlxuICAgIGlmICh0aGlzLnNob3VsZFVzZUNtZEtleVRvQWN0aXZhdGUoKSkge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG5cbiAgICB2YXIgcm93QW5kQ29sdW1uID0gdGhpcy5nZXRSb3dBbmRDb2x1bW5Gb3JNb3VzZUV2ZW50KGUpO1xuICAgIHZhciBjbGlja2FibGVSYW5nZXNBbmRDYWxsYmFjayA9IGF3YWl0IHRoaXMuZmluZENsaWNrYWJsZVJhbmdlc0FuZENhbGxiYWNrKFxuICAgICAgICAgIHRoaXMuZWRpdG9yLFxuICAgICAgICAgIHJvd0FuZENvbHVtbi5yb3csXG4gICAgICAgICAgcm93QW5kQ29sdW1uLmNvbHVtbixcbiAgICAgICAgICBlLnNoaWZ0S2V5KTtcbiAgICBpZiAoY2xpY2thYmxlUmFuZ2VzQW5kQ2FsbGJhY2spIHtcbiAgICAgIGNsaWNrYWJsZVJhbmdlc0FuZENhbGxiYWNrLmNhbGxiYWNrKCk7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZU1vdmUoZTogTW91c2VFdmVudCkge1xuICAgIHZhciBhY3RpdmUgPSB0aGlzLnNob3VsZFVzZUNtZEtleVRvQWN0aXZhdGUoKSA/IGUubWV0YUtleSA6IGUuYWx0S2V5O1xuICAgIGlmICghYWN0aXZlKSB7XG4gICAgICBpZiAodGhpcy5zeW1ib2xOYXZpZ2F0aW9uTWFya2Vycykge1xuICAgICAgICB0aGlzLnVwZGF0ZVN5bWJvbE5hdmlnYXRpb25NYXJrZXJzKG51bGwpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciByb3dBbmRDb2x1bW4gPSB0aGlzLmdldFJvd0FuZENvbHVtbkZvck1vdXNlRXZlbnQoZSk7XG4gICAgdGhpcy5maW5kQ2xpY2thYmxlUmFuZ2VzQW5kQ2FsbGJhY2soXG4gICAgICAgIHRoaXMuZWRpdG9yLCByb3dBbmRDb2x1bW4ucm93LCByb3dBbmRDb2x1bW4uY29sdW1uXG4gICAgKS50aGVuKChjbGlja2FibGVSYW5nZXNBbmRDYWxsYmFjaykgPT4ge1xuICAgICAgdmFyIGNsaWNrYWJsZVJhbmdlcyA9IGNsaWNrYWJsZVJhbmdlc0FuZENhbGxiYWNrID9cbiAgICAgICAgICBjbGlja2FibGVSYW5nZXNBbmRDYWxsYmFjay5jbGlja2FibGVSYW5nZXMgOiBudWxsO1xuICAgICAgdGhpcy51cGRhdGVTeW1ib2xOYXZpZ2F0aW9uTWFya2VycyhjbGlja2FibGVSYW5nZXMpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0Um93QW5kQ29sdW1uRm9yTW91c2VFdmVudChlKTogUG9pbnQge1xuICAgIC8vIGNvbXBvbmVudC5zY3JlZW5Qb3NpdGlvbkZvck1vdXNlRXZlbnQgaXMgYW4gdW5kb2N1bWVudGVkIG1ldGhvZCBidXQgaXRcbiAgICAvLyBtYXkgYmVjb21lIHB1YmxpYy4gU2VlIGRpc2N1c3Npb24gYXQgaHR0cHM6Ly9naXRodWIuY29tL2F0b20vYXRvbS9pc3N1ZXMvNzA4Mi5cbiAgICAvLyBUT0RPICh0NzMzNzAzOSkgQ29udmVydCB0byB0aGUgcHVibGljIG1ldGhvZCBpZiBpdCBiZWNvbWVzIHB1YmxpYy5cbiAgICB2YXIgc2NyZWVuUG9zaXRpb24gPSB0aGlzLmVkaXRvclZpZXcuY29tcG9uZW50LnNjcmVlblBvc2l0aW9uRm9yTW91c2VFdmVudChlKTtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IuYnVmZmVyUG9zaXRpb25Gb3JTY3JlZW5Qb3NpdGlvbihzY3JlZW5Qb3NpdGlvbik7XG4gIH1cblxuICAvLyByYW5nZSBtYXkgYmUgbnVsbC4gSWYgbnVsbCwgdGhlIG1hcmtlciB3aWxsIGJlIGNsZWFyZWQuXG4gIHVwZGF0ZVN5bWJvbE5hdmlnYXRpb25NYXJrZXJzKHJhbmdlczogP2FycmF5PFJhbmdlPikge1xuICAgIC8vIENsZWFyIHRoZSBleGlzdGluZyBtYXJrZXIsIGlmIGFwcHJvcHJpYXRlLlxuICAgIC8vIFRPRE8obWJvbGluKTogVGhpcyBtYXJrZXIgbmVlZHMgdG8gYmUgcmVtb3ZlZCBtb3JlIGFnZ3Jlc3NpdmVseSwgbGlrZSB3aGVuXG4gICAgLy8gdGhlIHVzZXIgcmVsZWFzZXMgdGhlIGFsdCBrZXkuIE5vdGUgdGhhdCB0aGUgc3ltYm9sLW5hdmlnYXRpb24gQ1NTIGNsYXNzXG4gICAgLy8gd2lsbCBhbHNvIGhhdmUgdG8gYmUgcmVtb3ZlZCwgdGhvdWdoIHdlIGRvIHRoYXQgdmlhIHRvZ2dsZUNsYXNzKCkgYXQgdGhlXG4gICAgLy8gZW5kIG9mIHRoaXMgbWV0aG9kIHRvIGxpbWl0IGhvdyBtdWNoIHdlIHRvdWNoIHRoZSBET00uXG4gICAgaWYgKHRoaXMuc3ltYm9sTmF2aWdhdGlvbk1hcmtlcnMpIHtcbiAgICAgIHRoaXMuc3ltYm9sTmF2aWdhdGlvbk1hcmtlcnMuZm9yRWFjaCgoc3ltYm9sTmF2aWdhdGlvbk1hcmtlcikgPT4ge1xuICAgICAgICBzeW1ib2xOYXZpZ2F0aW9uTWFya2VyLmRlc3Ryb3koKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5zeW1ib2xOYXZpZ2F0aW9uTWFya2VyID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAocmFuZ2VzKSB7XG4gICAgICB0aGlzLnN5bWJvbE5hdmlnYXRpb25NYXJrZXJzID0gcmFuZ2VzLm1hcCgocmFuZ2UpID0+IHtcbiAgICAgICAgdmFyIG1hcmtlciA9IHRoaXMuZWRpdG9yLm1hcmtCdWZmZXJSYW5nZShyYW5nZSwge2ludmFsaWRhdGU6ICduZXZlcid9KTtcbiAgICAgICAgdGhpcy5lZGl0b3IuZGVjb3JhdGVNYXJrZXIoXG4gICAgICAgICAgbWFya2VyLFxuICAgICAgICAgIHt0eXBlOiAnaGlnaGxpZ2h0JywgY2xhc3M6ICdzeW1ib2wtbmF2aWdhdGlvbid9KTtcbiAgICAgICAgcmV0dXJuIG1hcmtlcjtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLmVkaXRvclZpZXcuY2xhc3NMaXN0LnRvZ2dsZSgnc3ltYm9sLW5hdmlnYXRpb24nLCAhIXJhbmdlcyk7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuZWRpdG9yVmlldy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2VEb3duKTtcbiAgICB0aGlzLmVkaXRvclZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5vbk1vdXNlTW92ZSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xpY2tUb1N5bWJvbDtcbiJdfQ==