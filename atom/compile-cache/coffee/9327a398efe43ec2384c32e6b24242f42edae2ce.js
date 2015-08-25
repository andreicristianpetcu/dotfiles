(function() {
  "use strict";
  var Beautifier, JSBeautify,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = JSBeautify = (function(_super) {
    __extends(JSBeautify, _super);

    function JSBeautify() {
      return JSBeautify.__super__.constructor.apply(this, arguments);
    }

    JSBeautify.prototype.name = "CSScomb";

    JSBeautify.prototype.options = {
      CSS: false,
      LESS: false,
      Sass: false,
      SCSS: false
    };

    JSBeautify.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var Comb, comb, config, e, processedCSS, projectConfigPath, syntax, _ref, _ref1;
        Comb = require('csscomb');
        config = null;
        try {
          projectConfigPath = (_ref = atom.project.getDirectories()) != null ? (_ref1 = _ref[0]) != null ? _ref1.resolve('.csscomb.json') : void 0 : void 0;
          config = require(projectConfigPath);
        } catch (_error) {
          e = _error;
          config = Comb.getConfig('csscomb');
        }
        comb = new Comb(config);
        syntax = "css";
        switch (language) {
          case "LESS":
            syntax = "less";
            break;
          case "SCSS":
            syntax = "scss";
            break;
          case "Sass":
            syntax = "sass";
        }
        processedCSS = comb.processString(text, {
          syntax: syntax
        });
        return resolve(processedCSS);
      });
    };

    return JSBeautify;

  })(Beautifier);

}).call(this);
