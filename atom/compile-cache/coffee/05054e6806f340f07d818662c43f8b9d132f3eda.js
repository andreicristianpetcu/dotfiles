(function() {
  var LocationDataUtil, Range;

  Range = require('atom').Range;

  module.exports = LocationDataUtil = (function() {
    function LocationDataUtil() {}

    LocationDataUtil.locationDataToRange = function(_arg) {
      var first_column, first_line, last_column, last_line;
      first_line = _arg.first_line, first_column = _arg.first_column, last_line = _arg.last_line, last_column = _arg.last_column;
      if (last_line == null) {
        last_line = first_line;
      }
      if (last_column == null) {
        last_column = first_column;
      }
      return new Range([first_line, first_column], [last_line, last_column + 1]);
    };

    LocationDataUtil.rangeToLocationData = function(_arg) {
      var end, start;
      start = _arg.start, end = _arg.end;
      return {
        first_line: start.row,
        first_column: start.column,
        last_line: end.row,
        last_column: end.column - 1
      };
    };

    LocationDataUtil.isEqualsLocationData = function(a, b) {
      return a.first_line === b.first_line && a.first_column === b.first_column && a.last_line === b.last_line && a.last_column === b.last_column;
    };

    return LocationDataUtil;

  })();

}).call(this);
