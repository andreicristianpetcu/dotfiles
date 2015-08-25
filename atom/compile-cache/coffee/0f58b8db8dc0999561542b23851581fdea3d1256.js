(function() {
  var RefCountedTokenList;

  module.exports = RefCountedTokenList = (function() {
    function RefCountedTokenList() {
      this.clear();
    }

    RefCountedTokenList.prototype.clear = function() {
      this.references = {};
      return this.tokens = [];
    };

    RefCountedTokenList.prototype.getLength = function() {
      return this.tokens.length;
    };

    RefCountedTokenList.prototype.getTokens = function() {
      return this.tokens;
    };

    RefCountedTokenList.prototype.getTokenWrappers = function() {
      var key, tokenWrapper, _ref, _results;
      _ref = this.references;
      _results = [];
      for (key in _ref) {
        tokenWrapper = _ref[key];
        _results.push(tokenWrapper);
      }
      return _results;
    };

    RefCountedTokenList.prototype.getToken = function(tokenKey) {
      var _ref;
      return (_ref = this.getTokenWrapper(tokenKey)) != null ? _ref.token : void 0;
    };

    RefCountedTokenList.prototype.getTokenWrapper = function(tokenKey) {
      tokenKey = this.getTokenKey(tokenKey);
      return this.references[tokenKey];
    };

    RefCountedTokenList.prototype.refCountForToken = function(tokenKey) {
      var _ref, _ref1;
      tokenKey = this.getTokenKey(tokenKey);
      return (_ref = (_ref1 = this.references[tokenKey]) != null ? _ref1.count : void 0) != null ? _ref : 0;
    };

    RefCountedTokenList.prototype.addToken = function(token, tokenKey) {
      tokenKey = this.getTokenKey(token, tokenKey);
      return this.updateRefCount(tokenKey, token, 1);
    };

    RefCountedTokenList.prototype.removeToken = function(token, tokenKey) {
      tokenKey = this.getTokenKey(token, tokenKey);
      if (this.references[tokenKey] != null) {
        token = this.references[tokenKey].token;
        this.updateRefCount(tokenKey, token, -1);
        return true;
      } else {
        return false;
      }
    };


    /*
    Private Methods
     */

    RefCountedTokenList.prototype.updateRefCount = function(tokenKey, token, increment) {
      var _base, _ref;
      if (increment > 0 && (this.references[tokenKey] == null)) {
        if ((_base = this.references)[tokenKey] == null) {
          _base[tokenKey] = {
            tokenKey: tokenKey,
            token: token,
            count: 0
          };
        }
        this.addTokenToList(token);
      }
      if (this.references[tokenKey] != null) {
        this.references[tokenKey].count += increment;
      }
      if (((_ref = this.references[tokenKey]) != null ? _ref.count : void 0) <= 0) {
        delete this.references[tokenKey];
        return this.removeTokenFromList(token);
      }
    };

    RefCountedTokenList.prototype.addTokenToList = function(token) {
      return this.tokens.push(token);
    };

    RefCountedTokenList.prototype.removeTokenFromList = function(token) {
      var index;
      index = this.tokens.indexOf(token);
      if (index > -1) {
        return this.tokens.splice(index, 1);
      }
    };

    RefCountedTokenList.prototype.getTokenKey = function(token, tokenKey) {
      return (tokenKey != null ? tokenKey : token) + '$$';
    };

    return RefCountedTokenList;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsNkJBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFBLENBRFc7SUFBQSxDQUFiOztBQUFBLGtDQUdBLEtBQUEsR0FBTyxTQUFBLEdBQUE7QUFDTCxNQUFBLElBQUMsQ0FBQSxVQUFELEdBQWMsRUFBZCxDQUFBO2FBQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxHQUZMO0lBQUEsQ0FIUCxDQUFBOztBQUFBLGtDQU9BLFNBQUEsR0FBVyxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVg7SUFBQSxDQVBYLENBQUE7O0FBQUEsa0NBU0EsU0FBQSxHQUFXLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxPQUFKO0lBQUEsQ0FUWCxDQUFBOztBQUFBLGtDQVdBLGdCQUFBLEdBQWtCLFNBQUEsR0FBQTtBQUNoQixVQUFBLGlDQUFBO0FBQUM7QUFBQTtXQUFBLFdBQUE7aUNBQUE7QUFBQSxzQkFBQSxhQUFBLENBQUE7QUFBQTtzQkFEZTtJQUFBLENBWGxCLENBQUE7O0FBQUEsa0NBY0EsUUFBQSxHQUFVLFNBQUMsUUFBRCxHQUFBO0FBQ1IsVUFBQSxJQUFBO21FQUEwQixDQUFFLGVBRHBCO0lBQUEsQ0FkVixDQUFBOztBQUFBLGtDQWlCQSxlQUFBLEdBQWlCLFNBQUMsUUFBRCxHQUFBO0FBQ2YsTUFBQSxRQUFBLEdBQVcsSUFBQyxDQUFBLFdBQUQsQ0FBYSxRQUFiLENBQVgsQ0FBQTthQUNBLElBQUMsQ0FBQSxVQUFXLENBQUEsUUFBQSxFQUZHO0lBQUEsQ0FqQmpCLENBQUE7O0FBQUEsa0NBcUJBLGdCQUFBLEdBQWtCLFNBQUMsUUFBRCxHQUFBO0FBQ2hCLFVBQUEsV0FBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxXQUFELENBQWEsUUFBYixDQUFYLENBQUE7MEdBQytCLEVBRmY7SUFBQSxDQXJCbEIsQ0FBQTs7QUFBQSxrQ0F5QkEsUUFBQSxHQUFVLFNBQUMsS0FBRCxFQUFRLFFBQVIsR0FBQTtBQUNSLE1BQUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxXQUFELENBQWEsS0FBYixFQUFvQixRQUFwQixDQUFYLENBQUE7YUFDQSxJQUFDLENBQUEsY0FBRCxDQUFnQixRQUFoQixFQUEwQixLQUExQixFQUFpQyxDQUFqQyxFQUZRO0lBQUEsQ0F6QlYsQ0FBQTs7QUFBQSxrQ0ErQkEsV0FBQSxHQUFhLFNBQUMsS0FBRCxFQUFRLFFBQVIsR0FBQTtBQUNYLE1BQUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxXQUFELENBQWEsS0FBYixFQUFvQixRQUFwQixDQUFYLENBQUE7QUFDQSxNQUFBLElBQUcsaUNBQUg7QUFDRSxRQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsVUFBVyxDQUFBLFFBQUEsQ0FBUyxDQUFDLEtBQTlCLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxjQUFELENBQWdCLFFBQWhCLEVBQTBCLEtBQTFCLEVBQWlDLENBQUEsQ0FBakMsQ0FEQSxDQUFBO2VBRUEsS0FIRjtPQUFBLE1BQUE7ZUFLRSxNQUxGO09BRlc7SUFBQSxDQS9CYixDQUFBOztBQXdDQTtBQUFBOztPQXhDQTs7QUFBQSxrQ0E0Q0EsY0FBQSxHQUFnQixTQUFDLFFBQUQsRUFBVyxLQUFYLEVBQWtCLFNBQWxCLEdBQUE7QUFDZCxVQUFBLFdBQUE7QUFBQSxNQUFBLElBQUcsU0FBQSxHQUFZLENBQVosSUFBc0IsbUNBQXpCOztlQUNjLENBQUEsUUFBQSxJQUFhO0FBQUEsWUFBQyxVQUFBLFFBQUQ7QUFBQSxZQUFXLE9BQUEsS0FBWDtBQUFBLFlBQWtCLEtBQUEsRUFBTyxDQUF6Qjs7U0FBekI7QUFBQSxRQUNBLElBQUMsQ0FBQSxjQUFELENBQWdCLEtBQWhCLENBREEsQ0FERjtPQUFBO0FBSUEsTUFBQSxJQUE0QyxpQ0FBNUM7QUFBQSxRQUFBLElBQUMsQ0FBQSxVQUFXLENBQUEsUUFBQSxDQUFTLENBQUMsS0FBdEIsSUFBK0IsU0FBL0IsQ0FBQTtPQUpBO0FBTUEsTUFBQSxzREFBd0IsQ0FBRSxlQUF2QixJQUFnQyxDQUFuQztBQUNFLFFBQUEsTUFBQSxDQUFBLElBQVEsQ0FBQSxVQUFXLENBQUEsUUFBQSxDQUFuQixDQUFBO2VBQ0EsSUFBQyxDQUFBLG1CQUFELENBQXFCLEtBQXJCLEVBRkY7T0FQYztJQUFBLENBNUNoQixDQUFBOztBQUFBLGtDQXVEQSxjQUFBLEdBQWdCLFNBQUMsS0FBRCxHQUFBO2FBQ2QsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQWEsS0FBYixFQURjO0lBQUEsQ0F2RGhCLENBQUE7O0FBQUEsa0NBMERBLG1CQUFBLEdBQXFCLFNBQUMsS0FBRCxHQUFBO0FBQ25CLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFnQixLQUFoQixDQUFSLENBQUE7QUFDQSxNQUFBLElBQTRCLEtBQUEsR0FBUSxDQUFBLENBQXBDO2VBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLENBQWUsS0FBZixFQUFzQixDQUF0QixFQUFBO09BRm1CO0lBQUEsQ0ExRHJCLENBQUE7O0FBQUEsa0NBOERBLFdBQUEsR0FBYSxTQUFDLEtBQUQsRUFBUSxRQUFSLEdBQUE7YUFFWCxvQkFBQyxXQUFXLEtBQVosQ0FBQSxHQUFxQixLQUZWO0lBQUEsQ0E5RGIsQ0FBQTs7K0JBQUE7O01BRkYsQ0FBQTtBQUFBIgp9
//# sourceURL=/home/andrei/dotfiles/atom/packages/autocomplete-plus/lib/ref-counted-token-list.coffee