(function() {
  var SnippetParser, removeCharFromString;

  module.exports = SnippetParser = (function() {
    function SnippetParser() {}

    SnippetParser.prototype.reset = function() {
      this.inSnippet = false;
      this.inSnippetBody = false;
      this.snippetStart = -1;
      this.snippetEnd = -1;
      this.bodyStart = -1;
      this.bodyEnd = -1;
      return this.escapedBraceIndices = null;
    };

    SnippetParser.prototype.findSnippets = function(text) {
      var body, char, colonIndex, groupEnd, groupStart, i, index, rightBraceIndex, snippets, _i, _j, _len;
      if (!(text.length > 0 && text.indexOf('$') !== -1)) {
        return;
      }
      this.reset();
      snippets = [];
      for (index = _i = 0, _len = text.length; _i < _len; index = ++_i) {
        char = text[index];
        if (this.inSnippet && this.snippetEnd === index) {
          body = text.slice(this.bodyStart, this.bodyEnd + 1);
          body = this.removeBraceEscaping(body, this.bodyStart, this.escapedBraceIndices);
          snippets.push({
            snippetStart: this.snippetStart,
            snippetEnd: this.snippetEnd,
            bodyStart: this.bodyStart,
            bodyEnd: this.bodyEnd,
            body: body
          });
          this.reset();
          continue;
        }
        if (this.inSnippet && index >= this.bodyStart && index <= this.bodyEnd) {
          this.inBody = true;
        }
        if (this.inSnippet && (index > this.bodyEnd || index < this.bodyStart)) {
          this.inBody = false;
        }
        if (this.bodyStart === -1 || this.bodyEnd === -1) {
          this.inBody = false;
        }
        if (this.inSnippet && !this.inBody) {
          continue;
        }
        if (this.inSnippet && this.inBody) {
          continue;
        }
        if (!this.inSnippet && text.indexOf('${', index) === index) {
          colonIndex = text.indexOf(':', index + 3);
          if (colonIndex !== -1) {
            groupStart = index + 2;
            groupEnd = colonIndex - 1;
            if (groupEnd >= groupStart) {
              for (i = _j = groupStart; groupStart <= groupEnd ? _j < groupEnd : _j > groupEnd; i = groupStart <= groupEnd ? ++_j : --_j) {
                if (isNaN(parseInt(text.charAt(i)))) {
                  colonIndex = -1;
                }
              }
            } else {
              colonIndex = -1;
            }
          }
          rightBraceIndex = -1;
          if (colonIndex !== -1) {
            i = index + 4;
            while (true) {
              rightBraceIndex = text.indexOf('}', i);
              if (rightBraceIndex === -1) {
                break;
              }
              if (text.charAt(rightBraceIndex - 1) === '\\') {
                if (this.escapedBraceIndices == null) {
                  this.escapedBraceIndices = [];
                }
                this.escapedBraceIndices.push(rightBraceIndex - 1);
              } else {
                break;
              }
              i = rightBraceIndex + 1;
            }
          }
          if (colonIndex !== -1 && rightBraceIndex !== -1 && colonIndex < rightBraceIndex) {
            this.inSnippet = true;
            this.inBody = false;
            this.snippetStart = index;
            this.snippetEnd = rightBraceIndex;
            this.bodyStart = colonIndex + 1;
            this.bodyEnd = rightBraceIndex - 1;
            continue;
          } else {
            this.reset();
          }
        }
      }
      return snippets;
    };

    SnippetParser.prototype.removeBraceEscaping = function(body, bodyStart, escapedBraceIndices) {
      var bodyIndex, i, _i, _len;
      if (escapedBraceIndices != null) {
        for (i = _i = 0, _len = escapedBraceIndices.length; _i < _len; i = ++_i) {
          bodyIndex = escapedBraceIndices[i];
          body = removeCharFromString(body, bodyIndex - bodyStart - i);
        }
      }
      return body;
    };

    return SnippetParser;

  })();

  removeCharFromString = function(str, index) {
    return str.slice(0, index) + str.slice(index + 1);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1DQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTsrQkFDSjs7QUFBQSw0QkFBQSxLQUFBLEdBQU8sU0FBQSxHQUFBO0FBQ0wsTUFBQSxJQUFDLENBQUEsU0FBRCxHQUFhLEtBQWIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsS0FEakIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsQ0FBQSxDQUZoQixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsVUFBRCxHQUFjLENBQUEsQ0FIZCxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsU0FBRCxHQUFhLENBQUEsQ0FKYixDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsT0FBRCxHQUFXLENBQUEsQ0FMWCxDQUFBO2FBTUEsSUFBQyxDQUFBLG1CQUFELEdBQXVCLEtBUGxCO0lBQUEsQ0FBUCxDQUFBOztBQUFBLDRCQVNBLFlBQUEsR0FBYyxTQUFDLElBQUQsR0FBQTtBQUNaLFVBQUEsK0ZBQUE7QUFBQSxNQUFBLElBQUEsQ0FBQSxDQUFjLElBQUksQ0FBQyxNQUFMLEdBQWMsQ0FBZCxJQUFvQixJQUFJLENBQUMsT0FBTCxDQUFhLEdBQWIsQ0FBQSxLQUF1QixDQUFBLENBQXpELENBQUE7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLFFBQUEsR0FBVyxFQUZYLENBQUE7QUFPQSxXQUFBLDJEQUFBOzJCQUFBO0FBQ0UsUUFBQSxJQUFHLElBQUMsQ0FBQSxTQUFELElBQWUsSUFBQyxDQUFBLFVBQUQsS0FBZSxLQUFqQztBQUNFLFVBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLFNBQVos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
//# sourceURL=/home/andrei/dotfiles/atom/packages/autocomplete-plus/lib/snippet-parser.coffee