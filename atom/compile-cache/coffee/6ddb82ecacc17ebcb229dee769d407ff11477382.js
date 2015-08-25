(function() {
  "use strict";
  var Beautifier, Checker, JSCSFixer, checker, cliConfig,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  Checker = null;

  cliConfig = null;

  checker = null;

  module.exports = JSCSFixer = (function(_super) {
    __extends(JSCSFixer, _super);

    function JSCSFixer() {
      return JSCSFixer.__super__.constructor.apply(this, arguments);
    }

    JSCSFixer.prototype.name = "JSCS Fixer";

    JSCSFixer.prototype.options = {
      JavaScript: false
    };

    JSCSFixer.prototype.beautify = function(text, language, options) {
      this.verbose("JSCS Fixer language " + language);
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var config, editor, err, path, result;
          try {
            if (checker == null) {
              cliConfig = require('jscs/lib/cli-config');
              Checker = require('jscs');
              checker = new Checker();
              checker.registerDefaultRules();
            }
            editor = atom.workspace.getActiveTextEditor();
            path = editor != null ? editor.getPath() : void 0;
            config = path != null ? cliConfig.load(void 0, atom.project.relativizePath(path)[0]) : void 0;
            if (config == null) {
              throw new Error("No JSCS config found.");
            }
            checker.configure(config);
            result = checker.fixString(text, path);
            if (result.errors.getErrorCount() > 0) {
              _this.error(result.errors.getErrorList().reduce(function(res, err) {
                return "" + res + "<br> Line " + err.line + ": " + err.message;
              }, "JSCS Fixer error:"));
            }
            return resolve(result.output);
          } catch (_error) {
            err = _error;
            _this.error("JSCS Fixer error: " + err);
            return reject(err);
          }
        };
      })(this));
    };

    return JSCSFixer;

  })(Beautifier);

}).call(this);
