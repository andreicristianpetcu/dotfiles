{ Range } = require 'atom'

module.exports =
class LocationDataUtil

  @locationDataToRange: ({ first_line, first_column, last_line, last_column }) ->
    last_line ?= first_line
    last_column ?= first_column
    new Range [ first_line, first_column ], [ last_line, last_column + 1 ]

  @rangeToLocationData: ({ start, end }) ->
    first_line  : start.row
    first_column: start.column
    last_line   : end.row
    last_column : end.column - 1

  @isEqualsLocationData: (a, b) ->
    a.first_line   is b.first_line   and
    a.first_column is b.first_column and
    a.last_line    is b.last_line    and
    a.last_column  is b.last_column
