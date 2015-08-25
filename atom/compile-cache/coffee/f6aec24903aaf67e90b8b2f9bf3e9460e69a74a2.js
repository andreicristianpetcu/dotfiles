(function() {
  var CtagsProvider, checkSnippet, tagToSuggestion;

  checkSnippet = function(tag) {
    if (tag.kind === "require") {
      return tag.pattern.substring(2, tag.pattern.length - 2);
    }
    if (tag.kind === "function") {
      return tag.pattern.substring(tag.pattern.indexOf(tag.name), tag.pattern.length - 2);
    }
  };

  tagToSuggestion = function(tag) {
    return {
      text: tag.name,
      displayText: tag.pattern,
      type: tag.kind,
      snippet: checkSnippet(tag)
    };
  };

  module.exports = CtagsProvider = (function() {
    var prefix_opt, tag_options;

    function CtagsProvider() {}

    CtagsProvider.prototype.selector = '*';

    tag_options = {
      partialMatch: true,
      maxItems: 10
    };

    prefix_opt = {
      wordRegex: /[a-zA-Z0-9_]+[\.\:]/
    };

    CtagsProvider.prototype.getSuggestions = function(_arg) {
      var bufferPosition, editor, k, matches, output, prefix, scopeDescriptor, suggestions, tag, _i, _len;
      editor = _arg.editor, bufferPosition = _arg.bufferPosition, scopeDescriptor = _arg.scopeDescriptor, prefix = _arg.prefix;
      if (prefix === "." || prefix === ":") {
        prefix = editor.getWordUnderCursor(prefix_opt);
      }
      if (!prefix.length) {
        return;
      }
      matches = this.ctagsCache.findTags(prefix, tag_options);
      suggestions = [];
      if (tag_options.partialMatch) {
        output = {};
        k = 0;
        while (k < matches.length) {
          tag = matches[k++];
          if (output[tag.name]) {
            continue;
          }
          output[tag.name] = tag;
          suggestions.push(tagToSuggestion(tag));
        }
        if (suggestions.length === 1 && suggestions[0].text === prefix) {
          return [];
        }
      } else {
        for (_i = 0, _len = matches.length; _i < _len; _i++) {
          tag = matches[_i];
          suggestions.push(tagToSuggestion(tag));
        }
      }
      if (!suggestions.length) {
        return;
      }
      return suggestions;
    };

    return CtagsProvider;

  })();

}).call(this);
