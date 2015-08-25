
/*
Requires https://github.com/erniebrodeur/ruby-beautify
 */

(function() {
  "use strict";
  var Beautifier, RubyBeautify,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = RubyBeautify = (function(_super) {
    __extends(RubyBeautify, _super);

    function RubyBeautify() {
      return RubyBeautify.__super__.constructor.apply(this, arguments);
    }

    RubyBeautify.prototype.name = "Ruby Beautify";

    RubyBeautify.prototype.options = {
      Ruby: {
        indent_size: true,
        indent_char: true
      }
    };

    RubyBeautify.prototype.beautify = function(text, language, options) {
      return this.run("rbeautify", [options.indent_char === '\t' ? "--tabs" : "--spaces", "--indent_count", options.indent_size, this.tempFile("input", text)], {
        help: {
          link: "https://github.com/erniebrodeur/ruby-beautify"
        }
      });
    };

    return RubyBeautify;

  })(Beautifier);

}).call(this);
