(function() {
  "use strict";
  var Beautifier, TidyMarkdown,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = TidyMarkdown = (function(_super) {
    __extends(TidyMarkdown, _super);

    function TidyMarkdown() {
      return TidyMarkdown.__super__.constructor.apply(this, arguments);
    }

    TidyMarkdown.prototype.name = "Tidy Markdown";

    TidyMarkdown.prototype.options = {
      Markdown: false
    };

    TidyMarkdown.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var cleanMarkdown, tidyMarkdown;
        tidyMarkdown = require('tidy-markdown');
        cleanMarkdown = tidyMarkdown(text);
        return resolve(cleanMarkdown);
      });
    };

    return TidyMarkdown;

  })(Beautifier);

}).call(this);
