(function() {
  "use strict";
  var Beautifier, CoffeeFmt,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = CoffeeFmt = (function(_super) {
    __extends(CoffeeFmt, _super);

    function CoffeeFmt() {
      return CoffeeFmt.__super__.constructor.apply(this, arguments);
    }

    CoffeeFmt.prototype.name = "coffee-fmt";

    CoffeeFmt.prototype.options = {
      CoffeeScript: {
        tab: [
          "indent_size", "indent_char", "indent_with_tabs", function(indentSize, indentChar, indentWithTabs) {
            if (indentWithTabs) {
              return "\t";
            }
            return Array(indentSize + 1).join(indentChar);
          }
        ]
      }
    };

    CoffeeFmt.prototype.beautify = function(text, language, options) {
      this.verbose('beautify', language, options);
      return new this.Promise(function(resolve, reject) {
        var e, fmt, results;
        options.newLine = "\n";
        fmt = require('coffee-fmt');
        try {
          results = fmt.format(text, options);
          return resolve(results);
        } catch (_error) {
          e = _error;
          return reject(e);
        }
      });
    };

    return CoffeeFmt;

  })(Beautifier);

}).call(this);
