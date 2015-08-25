{ Context } = require '../vender/esrefactor'
{ parse } = require 'esprima'
{ Range } = require 'atom'

module.exports =
class Ripper

  @locToRange: ({ start, end }) ->
    new Range [ start.line - 1, start.column ], [ end.line - 1, end.column ]

  @scopeNames: [
    'source.js'
  ]

  parseOptions:
    loc: true
    range: true
    tokens: true
    tolerant: true

  constructor: ->
    @context = new Context

  destruct: ->
    delete @context

  parse: (code, callback) ->
    try
      syntax = parse code, @parseOptions
      @context.setCode syntax
      rLine = /.*(?:\r?\n|\n?\r)/g
      @lines = (result[0].length while (result = rLine.exec code)?)
      callback() if callback
    catch err
      { lineNumber, column, description } = err
      if lineNumber? and column? and description?
        callback [
          range  : new Range [lineNumber - 1, column], [lineNumber - 1, column]
          message: description
        ] if callback
      else
        # Logs uncaught parse error.
        console.warn err
        callback() if callback

  find: ({ row, column }) ->
    pos = 0
    while --row >= 0
      pos += @lines[row]
    pos += column

    identification = @context.identify pos
    return [] unless identification

    { declaration, references } = identification
    if declaration? and not (declaration in references)
      references.unshift declaration
    ranges = []
    for reference in references
      ranges.push Ripper.locToRange reference.loc
    ranges
