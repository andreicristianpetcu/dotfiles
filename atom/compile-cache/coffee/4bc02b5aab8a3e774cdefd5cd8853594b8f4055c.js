
/*
Requires https://github.com/threedaymonk/htmlbeautifier
 */

(function() {
  "use strict";
  var Beautifier, HTMLBeautifier,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = HTMLBeautifier = (function(_super) {
    __extends(HTMLBeautifier, _super);

    function HTMLBeautifier() {
      return HTMLBeautifier.__super__.constructor.apply(this, arguments);
    }

    HTMLBeautifier.prototype.name = "HTML Beautifier";

    HTMLBeautifier.prototype.options = {
      ERB: {
        indent_size: true
      }
    };

    HTMLBeautifier.prototype.beautify = function(text, language, options) {
      var tempFile;
      console.log('erb', options);
      return this.run("htmlbeautifier", ["--tab-stops", options.indent_size, tempFile = this.tempFile("temp", text)]).then((function(_this) {
        return function() {
          return _this.readFile(tempFile);
        };
      })(this));
    };

    return HTMLBeautifier;

  })(Beautifier);

}).call(this);
