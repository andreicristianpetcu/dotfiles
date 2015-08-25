(function() {
  var Range, Ripper, expectEqualRefs, expectNoRefs,
    __slice = [].slice;

  Ripper = require('../lib/js_refactor').Ripper;

  Range = require('atom').Range;

  expectNoRefs = function(ripper, range) {
    var resultRanges;
    resultRanges = ripper.find(range);
    return expect(resultRanges).toHaveLength(0);
  };

  expectEqualRefs = function() {
    var i, ranges, resultRange, resultRanges, ripper, _i, _len, _results;
    ripper = arguments[0], ranges = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    resultRanges = ripper.find(ranges[0].start);
    console.log(require('util').inspect(resultRanges));
    ranges.sort(function(a, b) {
      var delta;
      if ((delta = a.start.row - b.start.row) !== 0) {
        return delta;
      }
      return a.start.column - b.start.column;
    });
    expect(resultRanges).toHaveLength(ranges.length);
    _results = [];
    for (i = _i = 0, _len = resultRanges.length; _i < _len; i = ++_i) {
      resultRange = resultRanges[i];
      _results.push(expect(resultRange).toEqual(ranges[i]));
    }
    return _results;
  };

  describe('Ripper', function() {
    var ripper;
    ripper = new Ripper;
    it('should find refs in LF', function() {
      ripper.parse("var a;\na = 100;");
      expectEqualRefs(ripper, new Range([0, 4], [0, 5]), new Range([1, 0], [1, 1]));
      return expectEqualRefs(ripper, new Range([1, 0], [1, 1]), new Range([0, 4], [0, 5]));
    });
    it('should find refs in CR', function() {
      ripper.parse("var a;\ra = 100;");
      expectEqualRefs(ripper, new Range([0, 4], [0, 5]), new Range([1, 0], [1, 1]));
      return expectEqualRefs(ripper, new Range([1, 0], [1, 1]), new Range([0, 4], [0, 5]));
    });
    it('should find refs in CRLF', function() {
      ripper.parse("var a;\r\na = 100;");
      expectEqualRefs(ripper, new Range([0, 4], [0, 5]), new Range([1, 0], [1, 1]));
      return expectEqualRefs(ripper, new Range([1, 0], [1, 1]), new Range([0, 4], [0, 5]));
    });
    return it('should find refs in LFCR', function() {
      ripper.parse("var a;\r\na = 100;");
      expectEqualRefs(ripper, new Range([0, 4], [0, 5]), new Range([1, 0], [1, 1]));
      return expectEqualRefs(ripper, new Range([1, 0], [1, 1]), new Range([0, 4], [0, 5]));
    });
  });

}).call(this);
