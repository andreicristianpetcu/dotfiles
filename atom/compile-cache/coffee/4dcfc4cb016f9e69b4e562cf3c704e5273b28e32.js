(function() {
  var Context, Range, Ripper, parse,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Context = require('../vender/esrefactor').Context;

  parse = require('esprima').parse;

  Range = require('atom').Range;

  module.exports = Ripper = (function() {
    Ripper.locToRange = function(_arg) {
      var end, start;
      start = _arg.start, end = _arg.end;
      return new Range([start.line - 1, start.column], [end.line - 1, end.column]);
    };

    Ripper.scopeNames = ['source.js'];

    Ripper.prototype.parseOptions = {
      loc: true,
      range: true,
      tokens: true,
      tolerant: true
    };

    function Ripper() {
      this.context = new Context;
    }

    Ripper.prototype.destruct = function() {
      return delete this.context;
    };

    Ripper.prototype.parse = function(code, callback) {
      var column, description, err, lineNumber, rLine, result, syntax;
      try {
        syntax = parse(code, this.parseOptions);
        this.context.setCode(syntax);
        rLine = /.*(?:\r?\n|\n?\r)/g;
        this.lines = ((function() {
          var _results;
          _results = [];
          while ((result = rLine.exec(code)) != null) {
            _results.push(result[0].length);
          }
          return _results;
        })());
        if (callback) {
          return callback();
        }
      } catch (_error) {
        err = _error;
        lineNumber = err.lineNumber, column = err.column, description = err.description;
        if ((lineNumber != null) && (column != null) && (description != null)) {
          if (callback) {
            return callback([
              {
                range: new Range([lineNumber - 1, column], [lineNumber - 1, column]),
                message: description
              }
            ]);
          }
        } else {
          console.warn(err);
          if (callback) {
            return callback();
          }
        }
      }
    };

    Ripper.prototype.find = function(_arg) {
      var column, declaration, identification, pos, ranges, reference, references, row, _i, _len;
      row = _arg.row, column = _arg.column;
      pos = 0;
      while (--row >= 0) {
        pos += this.lines[row];
      }
      pos += column;
      identification = this.context.identify(pos);
      if (!identification) {
        return [];
      }
      declaration = identification.declaration, references = identification.references;
      if ((declaration != null) && !(__indexOf.call(references, declaration) >= 0)) {
        references.unshift(declaration);
      }
      ranges = [];
      for (_i = 0, _len = references.length; _i < _len; _i++) {
        reference = references[_i];
        ranges.push(Ripper.locToRange(reference.loc));
      }
      return ranges;
    };

    return Ripper;

  })();

}).call(this);
