
/*
Requires https://github.com/nrc/rustfmt
 */

(function() {
  "use strict";
  var Beautifier, Rustfmt,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = Rustfmt = (function(_super) {
    __extends(Rustfmt, _super);

    function Rustfmt() {
      return Rustfmt.__super__.constructor.apply(this, arguments);
    }

    Rustfmt.prototype.name = "rustfmt";

    Rustfmt.prototype.options = {
      Rust: true
    };

    Rustfmt.prototype.beautify = function(text, language, options) {
      var program, tmpFile;
      program = options.rustfmt_path || "rustfmt";
      return this.run(program, [tmpFile = this.tempFile("tmp", text)], {
        help: {
          link: "https://github.com/nrc/rustfmt",
          program: "rustfmt",
          pathOption: "Rust - Rustfmt Path"
        }
      }).then((function(_this) {
        return function() {
          return _this.readFile(tmpFile);
        };
      })(this));
    };

    return Rustfmt;

  })(Beautifier);

}).call(this);
