
/*
Requires http://golang.org/cmd/gofmt/
 */

(function() {
  "use strict";
  var Beautifier, Gofmt,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = Gofmt = (function(_super) {
    __extends(Gofmt, _super);

    function Gofmt() {
      return Gofmt.__super__.constructor.apply(this, arguments);
    }

    Gofmt.prototype.name = "gofmt";

    Gofmt.prototype.options = {
      Go: true
    };

    Gofmt.prototype.beautify = function(text, language, options) {
      return this.run("gofmt", [this.tempFile("input", text)]);
    };

    return Gofmt;

  })(Beautifier);

}).call(this);
