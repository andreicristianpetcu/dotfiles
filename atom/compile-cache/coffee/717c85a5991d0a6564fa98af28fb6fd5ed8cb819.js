
/*
Requires [puppet-link](http://puppet-lint.com/)
 */

(function() {
  "use strict";
  var Beautifier, PuppetFix,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = PuppetFix = (function(_super) {
    __extends(PuppetFix, _super);

    function PuppetFix() {
      return PuppetFix.__super__.constructor.apply(this, arguments);
    }

    PuppetFix.prototype.name = "puppet-lint";

    PuppetFix.prototype.options = {
      Puppet: true
    };

    PuppetFix.prototype.cli = function(options) {
      if (options.puppet_path == null) {
        return new Error("'puppet-lint' path is not set!" + " Please set this in the Atom Beautify package settings.");
      } else {
        return options.puppet_path;
      }
    };

    PuppetFix.prototype.beautify = function(text, language, options) {
      var tempFile;
      return this.run("puppet-lint", ['--fix', tempFile = this.tempFile("input", text)], {
        ignoreReturnCode: true,
        help: {
          link: "http://puppet-lint.com/"
        }
      }).then((function(_this) {
        return function() {
          return _this.readFile(tempFile);
        };
      })(this));
    };

    return PuppetFix;

  })(Beautifier);

}).call(this);
