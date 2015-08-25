(function() {
  var CompositeDisposable, DefaultSuggestionTypeIconHTML, IconTemplate, ItemTemplate, ListTemplate, SnippetEnd, SnippetParser, SnippetStart, SnippetStartAndEnd, SuggestionListElement, escapeHtml, isString,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  SnippetParser = require('./snippet-parser');

  isString = require('./type-helpers').isString;

  ItemTemplate = "<span class=\"icon-container\"></span>\n<span class=\"left-label\"></span>\n<span class=\"word-container\">\n  <span class=\"word\"></span>\n  <span class=\"right-label\"></span>\n</span>";

  ListTemplate = "<div class=\"suggestion-list-scroller\">\n  <ol class=\"list-group\"></ol>\n</div>\n<div class=\"suggestion-description\">\n  <span class=\"suggestion-description-content\"></span>\n  <a class=\"suggestion-description-more-link\" href=\"#\">More..</a>\n</div>";

  IconTemplate = '<i class="icon"></i>';

  DefaultSuggestionTypeIconHTML = {
    'snippet': '<i class="icon-move-right"></i>',
    'import': '<i class="icon-package"></i>',
    'require': '<i class="icon-package"></i>',
    'module': '<i class="icon-package"></i>',
    'package': '<i class="icon-package"></i>',
    'tag': '<i class="icon-code"></i>',
    'attribute': '<i class="icon-tag"></i>'
  };

  SnippetStart = 1;

  SnippetEnd = 2;

  SnippetStartAndEnd = 3;

  SuggestionListElement = (function(_super) {
    __extends(SuggestionListElement, _super);

    function SuggestionListElement() {
      return SuggestionListElement.__super__.constructor.apply(this, arguments);
    }

    SuggestionListElement.prototype.maxItems = 200;

    SuggestionListElement.prototype.emptySnippetGroupRegex = /(\$\{\d+\:\})|(\$\{\d+\})|(\$\d+)/ig;

    SuggestionListElement.prototype.nodePool = null;

    SuggestionListElement.prototype.createdCallback = function() {
      this.subscriptions = new CompositeDisposable;
      this.classList.add('popover-list', 'select-list', 'autocomplete-suggestion-list');
      this.registerMouseHandling();
      this.snippetParser = new SnippetParser;
      return this.nodePool = [];
    };

    SuggestionListElement.prototype.attachedCallback = function() {
      this.parentElement.classList.add('autocomplete-plus');
      this.addActiveClassToEditor();
      if (!this.ol) {
        this.renderList();
      }
      return this.itemsChanged();
    };

    SuggestionListElement.prototype.detachedCallback = function() {
      return this.removeActiveClassFromEditor();
    };

    SuggestionListElement.prototype.initialize = function(model) {
      this.model = model;
      if (model == null) {
        return;
      }
      this.subscriptions.add(this.model.onDidChangeItems(this.itemsChanged.bind(this)));
      this.subscriptions.add(this.model.onDidSelectNext(this.moveSelectionDown.bind(this)));
      this.subscriptions.add(this.model.onDidSelectPrevious(this.moveSelectionUp.bind(this)));
      this.subscriptions.add(this.model.onDidSelectPageUp(this.moveSelectionPageUp.bind(this)));
      this.subscriptions.add(this.model.onDidSelectPageDown(this.moveSelectionPageDown.bind(this)));
      this.subscriptions.add(this.model.onDidSelectTop(this.moveSelectionToTop.bind(this)));
      this.subscriptions.add(this.model.onDidSelectBottom(this.moveSelectionToBottom.bind(this)));
      this.subscriptions.add(this.model.onDidConfirmSelection(this.confirmSelection.bind(this)));
      this.subscriptions.add(this.model.onDidDispose(this.dispose.bind(this)));
      this.subscriptions.add(atom.config.observe('autocomplete-plus.suggestionListFollows', (function(_this) {
        return function(suggestionListFollows) {
          _this.suggestionListFollows = suggestionListFollows;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('autocomplete-plus.maxVisibleSuggestions', (function(_this) {
        return function(maxVisibleSuggestions) {
          _this.maxVisibleSuggestions = maxVisibleSuggestions;
        };
      })(this)));
      return this;
    };

    SuggestionListElement.prototype.registerMouseHandling = function() {
      this.onmousewheel = function(event) {
        return event.stopPropagation();
      };
      this.onmousedown = function(event) {
        var item;
        item = this.findItem(event);
        if ((item != null ? item.dataset.index : void 0) != null) {
          this.selectedIndex = item.dataset.index;
          return event.stopPropagation();
        }
      };
      return this.onmouseup = function(event) {
        var item;
        item = this.findItem(event);
        if ((item != null ? item.dataset.index : void 0) != null) {
          event.stopPropagation();
          return this.confirmSelection();
        }
      };
    };

    SuggestionListElement.prototype.findItem = function(event) {
      var item;
      item = event.target;
      while (item.tagName !== 'LI' && item !== this) {
        item = item.parentNode;
      }
      if (item.tagName === 'LI') {
        return item;
      }
    };

    SuggestionListElement.prototype.updateDescription = function(item) {
      var _ref, _ref1;
      item = item != null ? item : (_ref = this.model) != null ? (_ref1 = _ref.items) != null ? _ref1[this.selectedIndex] : void 0 : void 0;
      if (item == null) {
        return;
      }
      if ((item.description != null) && item.description.length > 0) {
        this.descriptionContainer.style.display = 'block';
        this.descriptionContent.textContent = item.description;
        if ((item.descriptionMoreURL != null) && (item.descriptionMoreURL.length != null)) {
          this.descriptionMoreLink.style.display = 'inline';
          return this.descriptionMoreLink.setAttribute('href', item.descriptionMoreURL);
        } else {
          this.descriptionMoreLink.style.display = 'none';
          return this.descriptionMoreLink.setAttribute('href', '#');
        }
      } else {
        return this.descriptionContainer.style.display = 'none';
      }
    };

    SuggestionListElement.prototype.itemsChanged = function() {
      var _ref, _ref1;
      if ((_ref = this.model) != null ? (_ref1 = _ref.items) != null ? _ref1.length : void 0 : void 0) {
        return this.render();
      } else {
        return this.returnItemsToPool(0);
      }
    };

    SuggestionListElement.prototype.render = function() {
      var _base;
      this.selectedIndex = 0;
      if (typeof (_base = atom.views).pollAfterNextUpdate === "function") {
        _base.pollAfterNextUpdate();
      }
      atom.views.updateDocument(this.renderItems.bind(this));
      return atom.views.readDocument(this.readUIPropsFromDOM.bind(this));
    };

    SuggestionListElement.prototype.addActiveClassToEditor = function() {
      var editorElement, _ref;
      editorElement = atom.views.getView(atom.workspace.getActiveTextEditor());
      return editorElement != null ? (_ref = editorElement.classList) != null ? _ref.add('autocomplete-active') : void 0 : void 0;
    };

    SuggestionListElement.prototype.removeActiveClassFromEditor = function() {
      var editorElement, _ref;
      editorElement = atom.views.getView(atom.workspace.getActiveTextEditor());
      return editorElement != null ? (_ref = editorElement.classList) != null ? _ref.remove('autocomplete-active') : void 0 : void 0;
    };

    SuggestionListElement.prototype.moveSelectionUp = function() {
      if (!(this.selectedIndex <= 0)) {
        return this.setSelectedIndex(this.selectedIndex - 1);
      } else {
        return this.setSelectedIndex(this.visibleItems().length - 1);
      }
    };

    SuggestionListElement.prototype.moveSelectionDown = function() {
      if (!(this.selectedIndex >= (this.visibleItems().length - 1))) {
        return this.setSelectedIndex(this.selectedIndex + 1);
      } else {
        return this.setSelectedIndex(0);
      }
    };

    SuggestionListElement.prototype.moveSelectionPageUp = function() {
      var newIndex;
      newIndex = Math.max(0, this.selectedIndex - this.maxVisibleSuggestions);
      if (this.selectedIndex !== newIndex) {
        return this.setSelectedIndex(newIndex);
      }
    };

    SuggestionListElement.prototype.moveSelectionPageDown = function() {
      var itemsLength, newIndex;
      itemsLength = this.visibleItems().length;
      newIndex = Math.min(itemsLength - 1, this.selectedIndex + this.maxVisibleSuggestions);
      if (this.selectedIndex !== newIndex) {
        return this.setSelectedIndex(newIndex);
      }
    };

    SuggestionListElement.prototype.moveSelectionToTop = function() {
      var newIndex;
      newIndex = 0;
      if (this.selectedIndex !== newIndex) {
        return this.setSelectedIndex(newIndex);
      }
    };

    SuggestionListElement.prototype.moveSelectionToBottom = function() {
      var newIndex;
      newIndex = this.visibleItems().length - 1;
      if (this.selectedIndex !== newIndex) {
        return this.setSelectedIndex(newIndex);
      }
    };

    SuggestionListElement.prototype.setSelectedIndex = function(index) {
      this.selectedIndex = index;
      return atom.views.updateDocument(this.renderSelectedItem.bind(this));
    };

    SuggestionListElement.prototype.visibleItems = function() {
      var _ref, _ref1;
      return (_ref = this.model) != null ? (_ref1 = _ref.items) != null ? _ref1.slice(0, this.maxItems) : void 0 : void 0;
    };

    SuggestionListElement.prototype.getSelectedItem = function() {
      var _ref, _ref1;
      return (_ref = this.model) != null ? (_ref1 = _ref.items) != null ? _ref1[this.selectedIndex] : void 0 : void 0;
    };

    SuggestionListElement.prototype.confirmSelection = function() {
      var item;
      if (!this.model.isActive()) {
        return;
      }
      item = this.getSelectedItem();
      if (item != null) {
        return this.model.confirm(item);
      } else {
        return this.model.cancel();
      }
    };

    SuggestionListElement.prototype.renderList = function() {
      this.innerHTML = ListTemplate;
      this.ol = this.querySelector('.list-group');
      this.scroller = this.querySelector('.suggestion-list-scroller');
      this.descriptionContainer = this.querySelector('.suggestion-description');
      this.descriptionContent = this.querySelector('.suggestion-description-content');
      return this.descriptionMoreLink = this.querySelector('.suggestion-description-more-link');
    };

    SuggestionListElement.prototype.renderItems = function() {
      var descLength, index, item, items, longestDesc, longestDescIndex, _i, _len, _ref;
      this.style.width = null;
      items = (_ref = this.visibleItems()) != null ? _ref : [];
      longestDesc = 0;
      longestDescIndex = null;
      for (index = _i = 0, _len = items.length; _i < _len; index = ++_i) {
        item = items[index];
        this.renderItem(item, index);
        descLength = this.descriptionLength(item);
        if (descLength > longestDesc) {
          longestDesc = descLength;
          longestDescIndex = index;
        }
      }
      this.updateDescription(items[longestDescIndex]);
      return this.returnItemsToPool(items.length);
    };

    SuggestionListElement.prototype.returnItemsToPool = function(pivotIndex) {
      var li;
      while ((this.ol != null) && (li = this.ol.childNodes[pivotIndex])) {
        li.remove();
        this.nodePool.push(li);
      }
    };

    SuggestionListElement.prototype.descriptionLength = function(item) {
      var count;
      count = 0;
      if (item.description != null) {
        count += item.description.length;
      }
      if (item.descriptionMoreURL != null) {
        count += 6;
      }
      return count;
    };

    SuggestionListElement.prototype.renderSelectedItem = function() {
      var _ref;
      if ((_ref = this.selectedLi) != null) {
        _ref.classList.remove('selected');
      }
      this.selectedLi = this.ol.childNodes[this.selectedIndex];
      if (this.selectedLi != null) {
        this.selectedLi.classList.add('selected');
        this.scrollSelectedItemIntoView();
        return this.updateDescription();
      }
    };

    SuggestionListElement.prototype.scrollSelectedItemIntoView = function() {
      var itemHeight, scrollTop, scrollerHeight, selectedItemTop;
      scrollTop = this.scroller.scrollTop;
      selectedItemTop = this.selectedLi.offsetTop;
      if (selectedItemTop < scrollTop) {
        return this.scroller.scrollTop = selectedItemTop;
      }
      itemHeight = this.uiProps.itemHeight;
      scrollerHeight = this.maxVisibleSuggestions * itemHeight + this.uiProps.paddingHeight;
      if (selectedItemTop + itemHeight > scrollTop + scrollerHeight) {
        return this.scroller.scrollTop = selectedItemTop - scrollerHeight + itemHeight;
      }
    };

    SuggestionListElement.prototype.readUIPropsFromDOM = function() {
      var wordContainer, _base, _base1, _ref, _ref1, _ref2;
      wordContainer = (_ref = this.selectedLi) != null ? _ref.querySelector('.word-container') : void 0;
      if (this.uiProps == null) {
        this.uiProps = {};
      }
      this.uiProps.width = this.offsetWidth + 1;
      this.uiProps.marginLeft = -((_ref1 = wordContainer != null ? wordContainer.offsetLeft : void 0) != null ? _ref1 : 0);
      if ((_base = this.uiProps).itemHeight == null) {
        _base.itemHeight = this.selectedLi.offsetHeight;
      }
      if ((_base1 = this.uiProps).paddingHeight == null) {
        _base1.paddingHeight = (_ref2 = parseInt(getComputedStyle(this)['padding-top']) + parseInt(getComputedStyle(this)['padding-bottom'])) != null ? _ref2 : 0;
      }
      if (atom.views.documentReadInProgress != null) {
        return atom.views.updateDocument(this.updateUIForChangedProps.bind(this));
      } else {
        return this.updateUIForChangedProps();
      }
    };

    SuggestionListElement.prototype.updateUIForChangedProps = function() {
      this.scroller.style['max-height'] = "" + (this.maxVisibleSuggestions * this.uiProps.itemHeight + this.uiProps.paddingHeight) + "px";
      this.style.width = "" + this.uiProps.width + "px";
      if (this.suggestionListFollows === 'Word') {
        this.style['margin-left'] = "" + this.uiProps.marginLeft + "px";
      }
      return this.updateDescription();
    };

    SuggestionListElement.prototype.addClassToElement = function(element, classNames) {
      var className, classes, _i, _len;
      if (classNames && (classes = classNames.split(' '))) {
        for (_i = 0, _len = classes.length; _i < _len; _i++) {
          className = classes[_i];
          className = className.trim();
          if (className) {
            element.classList.add(className);
          }
        }
      }
    };

    SuggestionListElement.prototype.renderItem = function(_arg, index) {
      var className, defaultIconHTML, defaultLetterIconHTML, displayText, iconHTML, leftLabel, leftLabelHTML, leftLabelSpan, li, replacementPrefix, rightLabel, rightLabelHTML, rightLabelSpan, sanitizedIconHTML, sanitizedType, snippet, text, type, typeIcon, typeIconContainer, wordSpan, _ref;
      iconHTML = _arg.iconHTML, type = _arg.type, snippet = _arg.snippet, text = _arg.text, displayText = _arg.displayText, className = _arg.className, replacementPrefix = _arg.replacementPrefix, leftLabel = _arg.leftLabel, leftLabelHTML = _arg.leftLabelHTML, rightLabel = _arg.rightLabel, rightLabelHTML = _arg.rightLabelHTML;
      li = this.ol.childNodes[index];
      if (!li) {
        if (this.nodePool.length > 0) {
          li = this.nodePool.pop();
        } else {
          li = document.createElement('li');
          li.innerHTML = ItemTemplate;
        }
        li.dataset.index = index;
        this.ol.appendChild(li);
      }
      li.className = '';
      if (index === this.selectedIndex) {
        li.classList.add('selected');
      }
      if (className) {
        this.addClassToElement(li, className);
      }
      if (index === this.selectedIndex) {
        this.selectedLi = li;
      }
      typeIconContainer = li.querySelector('.icon-container');
      typeIconContainer.innerHTML = '';
      sanitizedType = escapeHtml(isString(type) ? type : '');
      sanitizedIconHTML = isString(iconHTML) ? iconHTML : void 0;
      defaultLetterIconHTML = sanitizedType ? "<span class=\"icon-letter\">" + sanitizedType[0] + "</span>" : '';
      defaultIconHTML = (_ref = DefaultSuggestionTypeIconHTML[sanitizedType]) != null ? _ref : defaultLetterIconHTML;
      if ((sanitizedIconHTML || defaultIconHTML) && iconHTML !== false) {
        typeIconContainer.innerHTML = IconTemplate;
        typeIcon = typeIconContainer.childNodes[0];
        typeIcon.innerHTML = sanitizedIconHTML != null ? sanitizedIconHTML : defaultIconHTML;
        if (type) {
          this.addClassToElement(typeIcon, type);
        }
      }
      wordSpan = li.querySelector('.word');
      wordSpan.innerHTML = this.getDisplayHTML(text, snippet, displayText, replacementPrefix);
      leftLabelSpan = li.querySelector('.left-label');
      if (leftLabelHTML != null) {
        leftLabelSpan.innerHTML = leftLabelHTML;
      } else if (leftLabel != null) {
        leftLabelSpan.textContent = leftLabel;
      } else {
        leftLabelSpan.textContent = '';
      }
      rightLabelSpan = li.querySelector('.right-label');
      if (rightLabelHTML != null) {
        return rightLabelSpan.innerHTML = rightLabelHTML;
      } else if (rightLabel != null) {
        return rightLabelSpan.textContent = rightLabel;
      } else {
        return rightLabelSpan.textContent = '';
      }
    };

    SuggestionListElement.prototype.getDisplayHTML = function(text, snippet, displayText, replacementPrefix) {
      var character, characterMatchIndices, displayHTML, index, replacementText, snippetIndices, snippets, _i, _len, _ref, _ref1;
      replacementText = text;
      if (typeof displayText === 'string') {
        replacementText = displayText;
      } else if (typeof snippet === 'string') {
        replacementText = this.removeEmptySnippets(snippet);
        snippets = this.snippetParser.findSnippets(replacementText);
        replacementText = this.removeSnippetsFromText(snippets, replacementText);
        snippetIndices = this.findSnippetIndices(snippets);
      }
      characterMatchIndices = this.findCharacterMatchIndices(replacementText, replacementPrefix);
      displayHTML = '';
      for (index = _i = 0, _len = replacementText.length; _i < _len; index = ++_i) {
        character = replacementText[index];
        if ((_ref = snippetIndices != null ? snippetIndices[index] : void 0) === SnippetStart || _ref === SnippetStartAndEnd) {
          displayHTML += '<span class="snippet-completion">';
        }
        if (characterMatchIndices != null ? characterMatchIndices[index] : void 0) {
          displayHTML += '<span class="character-match">' + escapeHtml(replacementText[index]) + '</span>';
        } else {
          displayHTML += escapeHtml(replacementText[index]);
        }
        if ((_ref1 = snippetIndices != null ? snippetIndices[index] : void 0) === SnippetEnd || _ref1 === SnippetStartAndEnd) {
          displayHTML += '</span>';
        }
      }
      return displayHTML;
    };

    SuggestionListElement.prototype.removeEmptySnippets = function(text) {
      if (!((text != null ? text.length : void 0) && text.indexOf('$') !== -1)) {
        return text;
      }
      return text.replace(this.emptySnippetGroupRegex, '');
    };

    SuggestionListElement.prototype.removeSnippetsFromText = function(snippets, text) {
      var body, index, result, snippetEnd, snippetStart, _i, _len, _ref;
      if (!(text.length && (snippets != null ? snippets.length : void 0))) {
        return text;
      }
      index = 0;
      result = '';
      for (_i = 0, _len = snippets.length; _i < _len; _i++) {
        _ref = snippets[_i], snippetStart = _ref.snippetStart, snippetEnd = _ref.snippetEnd, body = _ref.body;
        result += text.slice(index, snippetStart) + body;
        index = snippetEnd + 1;
      }
      if (index !== text.length) {
        result += text.slice(index, text.length);
      }
      return result;
    };

    SuggestionListElement.prototype.findSnippetIndices = function(snippets) {
      var body, bodyLength, endIndex, indices, offsetAccumulator, snippetEnd, snippetLength, snippetStart, startIndex, _i, _len, _ref;
      if (snippets == null) {
        return;
      }
      indices = {};
      offsetAccumulator = 0;
      for (_i = 0, _len = snippets.length; _i < _len; _i++) {
        _ref = snippets[_i], snippetStart = _ref.snippetStart, snippetEnd = _ref.snippetEnd, body = _ref.body;
        bodyLength = body.length;
        snippetLength = snippetEnd - snippetStart + 1;
        startIndex = snippetStart - offsetAccumulator;
        endIndex = startIndex + bodyLength - 1;
        offsetAccumulator += snippetLength - bodyLength;
        if (startIndex === endIndex) {
          indices[startIndex] = SnippetStartAndEnd;
        } else {
          indices[startIndex] = SnippetStart;
          indices[endIndex] = SnippetEnd;
        }
      }
      return indices;
    };

    SuggestionListElement.prototype.findCharacterMatchIndices = function(text, replacementPrefix) {
      var ch, i, matches, wordIndex, _i, _len;
      if (!((text != null ? text.length : void 0) && (replacementPrefix != null ? replacementPrefix.length : void 0))) {
        return;
      }
      matches = {};
      wordIndex = 0;
      for (i = _i = 0, _len = replacementPrefix.length; _i < _len; i = ++_i) {
        ch = replacementPrefix[i];
        while (wordIndex < text.length && text[wordIndex].toLowerCase() !== ch.toLowerCase()) {
          wordIndex += 1;
        }
        if (wordIndex >= text.length) {
          break;
        }
        matches[wordIndex] = true;
        wordIndex += 1;
      }
      return matches;
    };

    SuggestionListElement.prototype.dispose = function() {
      var _ref;
      this.subscriptions.dispose();
      return (_ref = this.parentNode) != null ? _ref.removeChild(this) : void 0;
    };

    return SuggestionListElement;

  })(HTMLElement);

  escapeHtml = function(html) {
    return String(html).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  module.exports = SuggestionListElement = document.registerElement('autocomplete-suggestion-list', {
    prototype: SuggestionListElement.prototype
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNNQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSLENBRGhCLENBQUE7O0FBQUEsRUFFQyxXQUFZLE9BQUEsQ0FBUSxnQkFBUixFQUFaLFFBRkQsQ0FBQTs7QUFBQSxFQUlBLFlBQUEsR0FBZSw2TEFKZixDQUFBOztBQUFBLEVBYUEsWUFBQSxHQUFlLHFRQWJmLENBQUE7O0FBQUEsRUF1QkEsWUFBQSxHQUFlLHNCQXZCZixDQUFBOztBQUFBLEVBeUJBLDZCQUFBLEdBQ0U7QUFBQSxJQUFBLFNBQUEsRUFBVyxpQ0FBWDtBQUFBLElBQ0EsUUFBQSxFQUFVLDhCQURWO0FBQUEsSUFFQSxTQUFBLEVBQVcsOEJBRlg7QUFBQSxJQUdBLFFBQUEsRUFBVSw4QkFIVjtBQUFBLElBSUEsU0FBQSxFQUFXLDhCQUpYO0FBQUEsSUFLQSxLQUFBLEVBQU8sMkJBTFA7QUFBQSxJQU1BLFdBQUEsRUFBYSwwQkFOYjtHQTFCRixDQUFBOztBQUFBLEVBa0NBLFlBQUEsR0FBZSxDQWxDZixDQUFBOztBQUFBLEVBbUNBLFVBQUEsR0FBYSxDQW5DYixDQUFBOztBQUFBLEVBb0NBLGtCQUFBLEdBQXFCLENBcENyQixDQUFBOztBQUFBLEVBc0NNO0FBQ0osNENBQUEsQ0FBQTs7OztLQUFBOztBQUFBLG9DQUFBLFFBQUEsR0FBVSxHQUFWLENBQUE7O0FBQUEsb0NBQ0Esc0JBQUEsR0FBd0IscUNBRHhCLENBQUE7O0FBQUEsb0NBRUEsUUFBQSxHQUFVLElBRlYsQ0FBQTs7QUFBQSxvQ0FJQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FB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
//# sourceURL=/home/andrei/dotfiles/atom/packages/autocomplete-plus/lib/suggestion-list-element.coffee