(function() {
  var Function, Provider, _;

  Function = require('loophole').Function;

  _ = require('underscore-plus');

  module.exports = Provider = (function() {
    function Provider() {}

    Provider.prototype.manager = null;

    Provider.prototype.force = false;

    Provider.prototype.selector = '.source.js';

    Provider.prototype.disableForSelector = '.source.js .comment';

    Provider.prototype.inclusionPriority = 1;

    Provider.prototype.excludeLowerPriority = atom.config.get('atom-ternjs.excludeLowerPriorityProviders');

    Provider.prototype.init = function(manager) {
      return this.manager = manager;
    };

    Provider.prototype.isValidPrefix = function(prefix) {
      var e, _ref;
      if (prefix[prefix.length - 1] === '\.') {
        return true;
      }
      if ((_ref = prefix[prefix.length - 1]) != null ? _ref.match(/;|\s/) : void 0) {
        return false;
      }
      if (prefix.length > 1) {
        prefix = '_' + prefix;
      }
      try {
        (new Function("var " + prefix))();
      } catch (_error) {
        e = _error;
        return false;
      }
      return true;
    };

    Provider.prototype.checkPrefix = function(prefix) {
      if (prefix.match(/(\s|;|\.|\"|\')$/) || prefix.replace(/\s/g, '').length === 0) {
        return '';
      }
      return prefix;
    };

    Provider.prototype.getPrefix = function(editor, bufferPosition) {
      var line, regexp, _ref;
      regexp = /(([\$\w]+[\w-]*)|([.:;'"[{( ]+))$/g;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      return (_ref = line.match(regexp)) != null ? _ref[0] : void 0;
    };

    Provider.prototype.getSuggestions = function(_arg) {
      var activatedManually, bufferPosition, editor, prefix, scopeDescriptor, tempPrefix;
      editor = _arg.editor, bufferPosition = _arg.bufferPosition, scopeDescriptor = _arg.scopeDescriptor, prefix = _arg.prefix, activatedManually = _arg.activatedManually;
      if (!this.manager.client) {
        return [];
      }
      tempPrefix = this.getPrefix(editor, bufferPosition) || prefix;
      if (!this.isValidPrefix(tempPrefix) && !this.force && !activatedManually) {
        return [];
      }
      prefix = this.checkPrefix(tempPrefix);
      return new Promise((function(_this) {
        return function(resolve) {
          return _this.manager.client.update(editor.getURI(), editor.getText()).then(function() {
            return _this.manager.client.completions(editor.getURI(), {
              line: bufferPosition.row,
              ch: bufferPosition.column
            }).then(function(data) {
              var description, index, obj, suggestion, suggestionClone, suggestionsArr, url, _i, _len, _ref;
              if (!data.completions.length) {
                resolve([]);
                return;
              }
              suggestionsArr = [];
              _ref = data.completions;
              for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
                obj = _ref[index];
                obj = _this.manager.helper.formatTypeCompletion(obj);
                description = obj.doc ? obj.doc : null;
                url = obj.url ? obj.url : null;
                suggestion = {
                  text: obj.name,
                  replacementPrefix: prefix,
                  className: null,
                  type: obj._typeSelf,
                  leftLabel: obj.leftLabel,
                  snippet: obj._snippet,
                  description: description,
                  descriptionMoreURL: url
                };
                if (atom.config.get('atom-ternjs.useSnippetsAndFunction') && obj._hasParams) {
                  suggestionClone = _.clone(suggestion);
                  suggestionClone.type = 'snippet';
                  suggestion.snippet = obj._hasParams ? "" + obj.name + "(${" + 0 + ":" + "})" : "" + obj.name + "()";
                  suggestionsArr.push(suggestion);
                  suggestionsArr.push(suggestionClone);
                } else {
                  suggestionsArr.push(suggestion);
                }
              }
              return resolve(suggestionsArr);
            }, function(err) {
              return console.log(err);
            });
          });
        };
      })(this));
    };

    Provider.prototype.forceCompletion = function() {
      this.force = true;
      atom.commands.dispatch(atom.views.getView(atom.workspace.getActiveTextEditor()), 'autocomplete-plus:activate');
      return this.force = false;
    };

    return Provider;

  })();

}).call(this);
