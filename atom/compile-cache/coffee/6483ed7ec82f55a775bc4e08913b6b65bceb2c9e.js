
/*
Language Support and default options.
 */

(function() {
  "use strict";
  var Languages, extend, _;

  _ = require('lodash');

  extend = null;

  module.exports = Languages = (function() {
    Languages.prototype.languageNames = ["arduino", "c-sharp", "c", "coffeescript", "cpp", "css", "csv", "d", "ejs", "erb", "gherkin", "go", "fortran", "handlebars", "html", "java", "javascript", "json", "jsx", "less", "markdown", 'marko', "mustache", "objective-c", "pawn", "perl", "php", "puppet", "python", "ruby", "rust", "sass", "scss", "spacebars", "sql", "svg", "swig", "tss", "twig", "typescript", "vala", "visualforce", "xml"];


    /*
    Languages
     */

    Languages.prototype.languages = null;


    /*
    Namespaces
     */

    Languages.prototype.namespaces = null;


    /*
    Constructor
     */

    function Languages() {
      this.languages = _.map(this.languageNames, function(name) {
        return require("./" + name);
      });
      this.namespaces = _.map(this.languages, function(language) {
        return language.namespace;
      });
    }


    /*
    Get language for grammar and extension
     */

    Languages.prototype.getLanguages = function(_arg) {
      var extension, grammar, name, namespace;
      name = _arg.name, namespace = _arg.namespace, grammar = _arg.grammar, extension = _arg.extension;
      return _.union(_.filter(this.languages, function(language) {
        return _.isEqual(language.name, name);
      }), _.filter(this.languages, function(language) {
        return _.isEqual(language.namespace, namespace);
      }), _.filter(this.languages, function(language) {
        return _.contains(language.grammars, grammar);
      }), _.filter(this.languages, function(language) {
        return _.contains(language.extensions, extension);
      }));
    };

    return Languages;

  })();

}).call(this);
