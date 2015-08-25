(function() {
  var EscapeCharacterRegex, parseScopeChain, selectorForScopeChain, selectorsMatchScopeChain, slick;

  slick = require('atom-slick');

  EscapeCharacterRegex = /[-!"#$%&'*+,/:;=?@|^~()<>{}[\]]/g;

  parseScopeChain = function(scopeChain) {
    var scope, _i, _len, _ref, _ref1, _results;
    scopeChain = scopeChain.replace(EscapeCharacterRegex, function(match) {
      return "\\" + match[0];
    });
    _ref1 = (_ref = slick.parse(scopeChain)[0]) != null ? _ref : [];
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      scope = _ref1[_i];
      _results.push(scope);
    }
    return _results;
  };

  selectorForScopeChain = function(selectors, scopeChain) {
    var scopes, selector, _i, _len;
    for (_i = 0, _len = selectors.length; _i < _len; _i++) {
      selector = selectors[_i];
      scopes = parseScopeChain(scopeChain);
      while (scopes.length > 0) {
        if (selector.matches(scopes)) {
          return selector;
        }
        scopes.pop();
      }
    }
    return null;
  };

  selectorsMatchScopeChain = function(selectors, scopeChain) {
    return selectorForScopeChain(selectors, scopeChain) != null;
  };

  module.exports = {
    parseScopeChain: parseScopeChain,
    selectorsMatchScopeChain: selectorsMatchScopeChain,
    selectorForScopeChain: selectorForScopeChain
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZGQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxZQUFSLENBQVIsQ0FBQTs7QUFBQSxFQUVBLG9CQUFBLEdBQXVCLGtDQUZ2QixDQUFBOztBQUFBLEVBSUEsZUFBQSxHQUFrQixTQUFDLFVBQUQsR0FBQTtBQUNoQixRQUFBLHNDQUFBO0FBQUEsSUFBQSxVQUFBLEdBQWEsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsb0JBQW5CLEVBQXlDLFNBQUMsS0FBRCxHQUFBO2FBQVksSUFBQSxHQUFJLEtBQU0sQ0FBQSxDQUFBLEVBQXRCO0lBQUEsQ0FBekMsQ0FBYixDQUFBO0FBQ0E7QUFBQTtTQUFBLDRDQUFBO3dCQUFBO0FBQUEsb0JBQUEsTUFBQSxDQUFBO0FBQUE7b0JBRmdCO0VBQUEsQ0FKbEIsQ0FBQTs7QUFBQSxFQVFBLHFCQUFBLEdBQXdCLFNBQUMsU0FBRCxFQUFZLFVBQVosR0FBQTtBQUN0QixRQUFBLDBCQUFBO0FBQUEsU0FBQSxnREFBQTsrQkFBQTtBQUNFLE1BQUEsTUFBQSxHQUFTLGVBQUEsQ0FBZ0IsVUFBaEIsQ0FBVCxDQUFBO0FBQ0EsYUFBTSxNQUFNLENBQUMsTUFBUCxHQUFnQixDQUF0QixHQUFBO0FBQ0UsUUFBQSxJQUFtQixRQUFRLENBQUMsT0FBVCxDQUFpQixNQUFqQixDQUFuQjtBQUFBLGlCQUFPLFFBQVAsQ0FBQTtTQUFBO0FBQUEsUUFDQSxNQUFNLENBQUMsR0FBUCxDQUFBLENBREEsQ0FERjtNQUFBLENBRkY7QUFBQSxLQUFBO1dBS0EsS0FOc0I7RUFBQSxDQVJ4QixDQUFBOztBQUFBLEVBZ0JBLHdCQUFBLEdBQTJCLFNBQUMsU0FBRCxFQUFZLFVBQVosR0FBQTtXQUN6QixxREFEeUI7RUFBQSxDQWhCM0IsQ0FBQTs7QUFBQSxFQW1CQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQUFBLElBQUMsaUJBQUEsZUFBRDtBQUFBLElBQWtCLDBCQUFBLHdCQUFsQjtBQUFBLElBQTRDLHVCQUFBLHFCQUE1QztHQW5CakIsQ0FBQTtBQUFBIgp9
//# sourceURL=/home/andrei/dotfiles/atom/packages/autocomplete-plus/lib/scope-helpers.coffee