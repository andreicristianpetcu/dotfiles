{ Ripper } = require '../lib/js_refactor'
{ Range } = require 'atom'

expectNoRefs = (ripper, range) ->
  resultRanges = ripper.find range
  expect resultRanges
  .toHaveLength 0

expectEqualRefs = (ripper, ranges...) ->
  resultRanges = ripper.find ranges[0].start
  console.log require('util').inspect resultRanges
  ranges.sort (a, b) ->
    return delta if (delta = a.start.row - b.start.row) isnt 0
    a.start.column - b.start.column
  expect resultRanges
  .toHaveLength ranges.length
  for resultRange, i in resultRanges
    expect resultRange
    .toEqual ranges[i]

describe 'Ripper', ->

  ripper = new Ripper

  it 'should find refs in LF', ->
    ripper.parse "var a;\na = 100;"
    expectEqualRefs ripper,
      new Range([0, 4], [0, 5]),
      new Range([1, 0], [1, 1])
    expectEqualRefs ripper,
      new Range([1, 0], [1, 1]),
      new Range([0, 4], [0, 5])

  it 'should find refs in CR', ->
    ripper.parse "var a;\ra = 100;"
    expectEqualRefs ripper,
      new Range([0, 4], [0, 5]),
      new Range([1, 0], [1, 1])
    expectEqualRefs ripper,
      new Range([1, 0], [1, 1]),
      new Range([0, 4], [0, 5])

  it 'should find refs in CRLF', ->
    ripper.parse "var a;\r\na = 100;"
    expectEqualRefs ripper,
      new Range([0, 4], [0, 5]),
      new Range([1, 0], [1, 1])
    expectEqualRefs ripper,
      new Range([1, 0], [1, 1]),
      new Range([0, 4], [0, 5])

  it 'should find refs in LFCR', ->
    ripper.parse "var a;\r\na = 100;"
    expectEqualRefs ripper,
      new Range([0, 4], [0, 5]),
      new Range([1, 0], [1, 1])
    expectEqualRefs ripper,
      new Range([1, 0], [1, 1]),
      new Range([0, 4], [0, 5])
