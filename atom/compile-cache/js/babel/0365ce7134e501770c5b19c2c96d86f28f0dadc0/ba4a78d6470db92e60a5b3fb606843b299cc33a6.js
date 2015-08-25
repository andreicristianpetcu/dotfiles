'use babel';

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

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
  }, {
    key: 'updateSymbolNavigationMarkers',

    // range may be null. If null, the marker will be cleared.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FuZHJlaS8uYXRvbS9wYWNrYWdlcy9udWNsaWRlLWNsaWNrLXRvLXN5bWJvbC9saWIvQ2xpY2tUb1N5bWJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztlQVdRLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQzs7SUFBM0MsV0FBVyxZQUFYLFdBQVc7O0lBRVYsYUFBYTs7Ozs7Ozs7QUFRTixXQVJQLGFBQWEsQ0FTYixVQUFzQixFQUN0Qix5QkFBd0MsRUFDeEMsOEJBQWdILEVBQUU7MEJBWGxILGFBQWE7O0FBWWYsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNqRCxRQUFJLENBQUMsK0JBQStCLEdBQUcsOEJBQThCLENBQUM7QUFDdEUsUUFBSSxDQUFDLHlCQUF5QixHQUFHLHlCQUF5QixDQUFDO0FBQzNELFFBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUM7O0FBRXBDLFFBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDOztBQUV6QixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9DLFFBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFaEUsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQyxRQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7R0FDakU7O3dCQXhCRyxhQUFhOztpQkEwQmhCLFdBQVcsRUFBRTtXQUNnQiwwQ0FBbUI7d0NBQWYsSUFBSTtBQUFKLFlBQUk7OztBQUNwQyxhQUFPLElBQUksQ0FB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VSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ2pFOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNuRSxVQUFJLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDcEU7OztTQTlHRyxhQUFhOzs7QUErR2xCLENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMiLCJmaWxlIjoiL2hvbWUvYW5kcmVpLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtY2xpY2stdG8tc3ltYm9sL2xpYi9DbGlja1RvU3ltYm9sLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4vKiBAZmxvdyAqL1xuXG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxudmFyIHt0cmFja1RpbWluZ30gPSByZXF1aXJlKCdudWNsaWRlLWFuYWx5dGljcycpO1xuXG5jbGFzcyBDbGlja1RvU3ltYm9sIHtcbiAgc3ltYm9sTmF2aWdhdGlvbk1hcmtlcnM6ID9hcnJheTxEaXNwbGF5QnVmZmVyTWFya2VyPjtcblxuICAvKipcbiAgICogUHJvbWlzZSB0aGF0IGBmaW5kRGVsZWdhdGVBbmRDbGlja2FibGVSYW5nZXNgIHJlc29sdmVzIHRvIGFcbiAgICoge2RlbGVnYXRlOiBDbGlja1RvU3ltYm9sRGVsZWdhdGU7IGNsaWNrYWJsZVJhbmdlczogP2FycmF5PFJhbmdlPn0gb3IgbnVsbFxuICAgKiBpZiBubyBkZWxlZ2F0ZSBjYW4gaGFuZGxlIGNsaWNrIHRvIGdpdmVuIHBvc2l0aW9uLlxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgICB0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yLFxuICAgICAgc2hvdWxkVXNlQ21kS2V5VG9BY3RpdmF0ZTogKCkgPT4gYm9vbGVhbixcbiAgICAgIGZpbmRDbGlja2FibGVSYW5nZXNBbmRDYWxsYmFjazogPyhlZGl0b3I6IFRleHRFZGl0b3IsIHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgc2hpZnRLZXk6IGJvb2xlYW4pID0+IFByb21pc2UpIHtcbiAgICB0aGlzLmVkaXRvclZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcodGV4dEVkaXRvcik7XG4gICAgdGhpcy5fZmluZENsaWNrYWJsZVJhbmdlc0FuZENhbGxiYWNrID0gZmluZENsaWNrYWJsZVJhbmdlc0FuZENhbGxiYWNrO1xuICAgIHRoaXMuc2hvdWxkVXNlQ21kS2V5VG9BY3RpdmF0ZSA9IHNob3VsZFVzZUNtZEtleVRvQWN0aXZhdGU7XG4gICAgdGhpcy5zeW1ib2xOYXZpZ2F0aW9uTWFya2VycyA9IG51bGw7XG5cbiAgICB0aGlzLmVkaXRvciA9IHRleHRFZGl0b3I7XG5cbiAgICB0aGlzLm9uTW91c2VEb3duID0gdGhpcy5vbk1vdXNlRG93bi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZWRpdG9yVmlldy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2VEb3duKTtcblxuICAgIHRoaXMub25Nb3VzZU1vdmUgPSB0aGlzLm9uTW91c2VNb3ZlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5lZGl0b3JWaWV3LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Nb3VzZU1vdmUpO1xuICB9XG5cbiAgQHRyYWNrVGltaW5nKClcbiAgZmluZENsaWNrYWJsZVJhbmdlc0FuZENhbGxiYWNrKC4uLmFyZ3MpOiBQcm9taXNlIHtcbiAgICByZXR1cm4gdGhpcy5fZmluZENsaWNrYWJsZVJhbmdlc0FuZENhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgYXN5bmMgb25Nb3VzZURvd24oZTogTW91c2VFdmVudCkge1xuICAgIHZhciBhY3RpdmUgPSB0aGlzLnNob3VsZFVzZUNtZEtleVRvQWN0aXZhdGUoKSA/IGUubWV0YUtleSA6IGUuYWx0S2V5O1xuICAgIGlmICghYWN0aXZlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIEJ5IGRlZmF1bHQgYXRvbSdzIHRleHQgZWRpdG9yIHdpbGwgdHJ5IHRvIGFkZCBhbm90aGVyXG4gICAgLy8gY3Vyc29yIG9uIHRoZSBzY3JlZW4gd2l0aCBtZXRhK2NsaWNrLiBJZiB3ZSdyZSBoaWphY2tpbmcgdGhlXG4gICAgLy8gbWV0YSBrZXksIGRpc2FibGUgdGhpcyBiZWhhdmlvci5cbiAgICBpZiAodGhpcy5zaG91bGRVc2VDbWRLZXlUb0FjdGl2YXRlKCkpIHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgdmFyIHJvd0FuZENvbHVtbiA9IHRoaXMuZ2V0Um93QW5kQ29sdW1uRm9yTW91c2VFdmVudChlKTtcbiAgICB2YXIgY2xpY2thYmxlUmFuZ2VzQW5kQ2FsbGJhY2sgPSBhd2FpdCB0aGlzLmZpbmRDbGlja2FibGVSYW5nZXNBbmRDYWxsYmFjayhcbiAgICAgICAgICB0aGlzLmVkaXRvcixcbiAgICAgICAgICByb3dBbmRDb2x1bW4ucm93LFxuICAgICAgICAgIHJvd0FuZENvbHVtbi5jb2x1bW4sXG4gICAgICAgICAgZS5zaGlmdEtleSk7XG4gICAgaWYgKGNsaWNrYWJsZVJhbmdlc0FuZENhbGxiYWNrKSB7XG4gICAgICBjbGlja2FibGVSYW5nZXNBbmRDYWxsYmFjay5jYWxsYmFjaygpO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGU6IE1vdXNlRXZlbnQpIHtcbiAgICB2YXIgYWN0aXZlID0gdGhpcy5zaG91bGRVc2VDbWRLZXlUb0FjdGl2YXRlKCkgPyBlLm1ldGFLZXkgOiBlLmFsdEtleTtcbiAgICBpZiAoIWFjdGl2ZSkge1xuICAgICAgaWYgKHRoaXMuc3ltYm9sTmF2aWdhdGlvbk1hcmtlcnMpIHtcbiAgICAgICAgdGhpcy51cGRhdGVTeW1ib2xOYXZpZ2F0aW9uTWFya2VycyhudWxsKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgcm93QW5kQ29sdW1uID0gdGhpcy5nZXRSb3dBbmRDb2x1bW5Gb3JNb3VzZUV2ZW50KGUpO1xuICAgIHRoaXMuZmluZENsaWNrYWJsZVJhbmdlc0FuZENhbGxiYWNrKFxuICAgICAgICB0aGlzLmVkaXRvciwgcm93QW5kQ29sdW1uLnJvdywgcm93QW5kQ29sdW1uLmNvbHVtblxuICAgICkudGhlbigoY2xpY2thYmxlUmFuZ2VzQW5kQ2FsbGJhY2spID0+IHtcbiAgICAgIHZhciBjbGlja2FibGVSYW5nZXMgPSBjbGlja2FibGVSYW5nZXNBbmRDYWxsYmFjayA/XG4gICAgICAgICAgY2xpY2thYmxlUmFuZ2VzQW5kQ2FsbGJhY2suY2xpY2thYmxlUmFuZ2VzIDogbnVsbDtcbiAgICAgIHRoaXMudXBkYXRlU3ltYm9sTmF2aWdhdGlvbk1hcmtlcnMoY2xpY2thYmxlUmFuZ2VzKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFJvd0FuZENvbHVtbkZvck1vdXNlRXZlbnQoZSk6IFBvaW50IHtcbiAgICAvLyBjb21wb25lbnQuc2NyZWVuUG9zaXRpb25Gb3JNb3VzZUV2ZW50IGlzIGFuIHVuZG9jdW1lbnRlZCBtZXRob2QgYnV0IGl0XG4gICAgLy8gbWF5IGJlY29tZSBwdWJsaWMuIFNlZSBkaXNjdXNzaW9uIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9hdG9tL2F0b20vaXNzdWVzLzcwODIuXG4gICAgLy8gVE9ETyAodDczMzcwMzkpIENvbnZlcnQgdG8gdGhlIHB1YmxpYyBtZXRob2QgaWYgaXQgYmVjb21lcyBwdWJsaWMuXG4gICAgdmFyIHNjcmVlblBvc2l0aW9uID0gdGhpcy5lZGl0b3JWaWV3LmNvbXBvbmVudC5zY3JlZW5Qb3NpdGlvbkZvck1vdXNlRXZlbnQoZSk7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yLmJ1ZmZlclBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24oc2NyZWVuUG9zaXRpb24pO1xuICB9XG5cbiAgLy8gcmFuZ2UgbWF5IGJlIG51bGwuIElmIG51bGwsIHRoZSBtYXJrZXIgd2lsbCBiZSBjbGVhcmVkLlxuICB1cGRhdGVTeW1ib2xOYXZpZ2F0aW9uTWFya2VycyhyYW5nZXM6ID9hcnJheTxSYW5nZT4pIHtcbiAgICAvLyBDbGVhciB0aGUgZXhpc3RpbmcgbWFya2VyLCBpZiBhcHByb3ByaWF0ZS5cbiAgICAvLyBUT0RPKG1ib2xpbik6IFRoaXMgbWFya2VyIG5lZWRzIHRvIGJlIHJlbW92ZWQgbW9yZSBhZ2dyZXNzaXZlbHksIGxpa2Ugd2hlblxuICAgIC8vIHRoZSB1c2VyIHJlbGVhc2VzIHRoZSBhbHQga2V5LiBOb3RlIHRoYXQgdGhlIHN5bWJvbC1uYXZpZ2F0aW9uIENTUyBjbGFzc1xuICAgIC8vIHdpbGwgYWxzbyBoYXZlIHRvIGJlIHJlbW92ZWQsIHRob3VnaCB3ZSBkbyB0aGF0IHZpYSB0b2dnbGVDbGFzcygpIGF0IHRoZVxuICAgIC8vIGVuZCBvZiB0aGlzIG1ldGhvZCB0byBsaW1pdCBob3cgbXVjaCB3ZSB0b3VjaCB0aGUgRE9NLlxuICAgIGlmICh0aGlzLnN5bWJvbE5hdmlnYXRpb25NYXJrZXJzKSB7XG4gICAgICB0aGlzLnN5bWJvbE5hdmlnYXRpb25NYXJrZXJzLmZvckVhY2goKHN5bWJvbE5hdmlnYXRpb25NYXJrZXIpID0+IHtcbiAgICAgICAgc3ltYm9sTmF2aWdhdGlvbk1hcmtlci5kZXN0cm95KCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc3ltYm9sTmF2aWdhdGlvbk1hcmtlciA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHJhbmdlcykge1xuICAgICAgdGhpcy5zeW1ib2xOYXZpZ2F0aW9uTWFya2VycyA9IHJhbmdlcy5tYXAoKHJhbmdlKSA9PiB7XG4gICAgICAgIHZhciBtYXJrZXIgPSB0aGlzLmVkaXRvci5tYXJrQnVmZmVyUmFuZ2UocmFuZ2UsIHtpbnZhbGlkYXRlOiAnbmV2ZXInfSk7XG4gICAgICAgIHRoaXMuZWRpdG9yLmRlY29yYXRlTWFya2VyKFxuICAgICAgICAgIG1hcmtlcixcbiAgICAgICAgICB7dHlwZTogJ2hpZ2hsaWdodCcsIGNsYXNzOiAnc3ltYm9sLW5hdmlnYXRpb24nfSk7XG4gICAgICAgIHJldHVybiBtYXJrZXI7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5lZGl0b3JWaWV3LmNsYXNzTGlzdC50b2dnbGUoJ3N5bWJvbC1uYXZpZ2F0aW9uJywgISFyYW5nZXMpO1xuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmVkaXRvclZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5vbk1vdXNlRG93bik7XG4gICAgdGhpcy5lZGl0b3JWaWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Nb3VzZU1vdmUpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENsaWNrVG9TeW1ib2w7XG4iXX0=