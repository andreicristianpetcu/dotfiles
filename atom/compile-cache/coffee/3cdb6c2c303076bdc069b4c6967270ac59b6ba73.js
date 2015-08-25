
/*
Requires http://pear.php.net/package/PHP_Beautifier
 */

(function() {
  "use strict";
  var fs, possibleOptions, temp;

  fs = require("fs");

  temp = require("temp").track();

  possibleOptions = require("./possible-options.json");

  module.exports = function(options, cb) {
    var ic, isPossible, k, text, v, vs;
    text = "";
    options.output_tab_size = options.output_tab_size || options.indent_size;
    options.input_tab_size = options.input_tab_size || options.indent_size;
    delete options.indent_size;
    ic = options.indent_char;
    if (options.indent_with_tabs === 0 || options.indent_with_tabs === 1 || options.indent_with_tabs === 2) {

    } else if (ic === " ") {
      options.indent_with_tabs = 0;
    } else if (ic === "\t") {
      options.indent_with_tabs = 2;
    } else {
      options.indent_with_tabs = 1;
    }
    delete options.indent_char;
    delete options.languageOverride;
    delete options.configPath;
    for (k in options) {
      isPossible = possibleOptions.indexOf(k) !== -1;
      if (isPossible) {
        v = options[k];
        vs = v;
        if (typeof vs === "boolean") {
          if (vs === true) {
            vs = "True";
          } else {
            vs = "False";
          }
        }
        text += k + " = " + vs + "\n";
      } else {
        delete options[k];
      }
    }
    return temp.open({
      suffix: ".cfg"
    }, function(err, info) {
      if (!err) {
        return fs.write(info.fd, text || "", function(err) {
          if (err) {
            return cb(err);
          }
          return fs.close(info.fd, function(err) {
            if (err) {
              return cb(err);
            }
            return cb(null, info.path);
          });
        });
      } else {
        return cb(err);
      }
    });
  };

}).call(this);
