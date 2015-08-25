(function() {
  var fuzzy, levenshtein;

  fuzzy = {};

  module.exports = fuzzy;

  fuzzy.simpleFilter = function(pattern, array) {
    return array.filter(function(string) {
      return fuzzy.test(pattern, string);
    });
  };

  fuzzy.test = function(pattern, string) {
    return fuzzy.match(pattern, string) !== null;
  };

  fuzzy.match = function(pattern, string, opts) {
    var ch, compareChar, compareString, currScore, idx, len, patternIdx, post, pre, result, totalScore;
    if (opts == null) {
      opts = {};
    }
    patternIdx = 0;
    result = [];
    len = string.length;
    totalScore = 0;
    currScore = 0;
    pre = opts.pre || "";
    post = opts.post || "";
    compareString = opts.caseSensitive && string || string.toLowerCase();
    ch = void 0;
    compareChar = void 0;
    pattern = opts.caseSensitive && pattern || pattern.toLowerCase();
    idx = 0;
    while (idx < len) {
      if (pattern[patternIdx] === ' ') {
        patternIdx++;
      }
      ch = string[idx];
      if (compareString[idx] === pattern[patternIdx]) {
        ch = pre + ch + post;
        patternIdx += 1;
        currScore += 1 + currScore;
      } else {
        currScore = 0;
      }
      totalScore += currScore;
      result[result.length] = ch;
      idx++;
    }
    if (patternIdx === pattern.length) {
      return {
        rendered: result.join(""),
        score: totalScore
      };
    }
  };

  fuzzy.filter = function(pattern, arr, opts) {
    var highlighted;
    if (opts == null) {
      opts = {};
    }
    highlighted = arr.reduce(function(prev, element, idx, arr) {
      var rendered, str;
      str = element;
      if (opts.extract) {
        str = opts.extract(element);
      }
      rendered = fuzzy.match(pattern, str, opts);
      if (rendered != null) {
        prev[prev.length] = {
          string: rendered.rendered,
          score: rendered.score,
          index: idx,
          original: element
        };
      }
      return prev;
    }, []).sort(function(a, b) {
      var compare;
      compare = b.score - a.score;
      if (compare === 0) {
        if (opts.extract) {
          return opts.extract(a.original).length - opts.extract(b.original).length;
        }
        return a.original.length - b.original.length;
      }
      if (compare) {
        return compare;
      }
      return a.index - b.index;
    });
    if (highlighted.length < 1) {
      highlighted = arr.reduce(function(prev, element, idx, arr) {
        var str;
        str = element;
        if (opts.extract) {
          str = opts.extract(element);
        }
        prev[prev.length] = {
          string: str,
          score: levenshtein(pattern, str),
          index: idx,
          original: element
        };
        return prev;
      }, []).sort(function(a, b) {
        var compare;
        compare = a.score - b.score;
        if (compare) {
          return compare;
        }
        return b.index - a.index;
      });
    }
    return highlighted;
  };


  /*
   * Copyright (c) 2011 Andrei Mackenzie
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy of
   * this software and associated documentation files (the "Software"), to deal in
   * the Software without restriction, including without limitation the rights to
   * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
   * the Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
   * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
   * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
   * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
   * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */

  levenshtein = function(a, b) {
    var i, j, matrix;
    if (a.length === 0) {
      return b.length;
    }
    if (b.length === 0) {
      return a.length;
    }
    matrix = [];
    i = void 0;
    i = 0;
    while (i <= b.length) {
      matrix[i] = [i];
      i++;
    }
    j = void 0;
    j = 0;
    while (j <= a.length) {
      matrix[0][j] = j;
      j++;
    }
    i = 1;
    while (i <= b.length) {
      j = 1;
      while (j <= a.length) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
        }
        j++;
      }
      i++;
    }
    return matrix[b.length][a.length];
  };

}).call(this);
