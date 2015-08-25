(function() {
  var ProviderMetadata, Selector, selectorForScopeChain, selectorsMatchScopeChain, _ref;

  Selector = require('selector-kit').Selector;

  _ref = require('./scope-helpers'), selectorForScopeChain = _ref.selectorForScopeChain, selectorsMatchScopeChain = _ref.selectorsMatchScopeChain;

  module.exports = ProviderMetadata = (function() {
    function ProviderMetadata(provider, apiVersion) {
      var providerBlacklist, _ref1;
      this.provider = provider;
      this.apiVersion = apiVersion;
      this.selectors = Selector.create(this.provider.selector);
      if (this.provider.disableForSelector != null) {
        this.disableForSelectors = Selector.create(this.provider.disableForSelector);
      }
      if (providerBlacklist = (_ref1 = this.provider.providerblacklist) != null ? _ref1['autocomplete-plus-fuzzyprovider'] : void 0) {
        this.disableDefaultProviderSelectors = Selector.create(providerBlacklist);
      }
    }

    ProviderMetadata.prototype.matchesScopeChain = function(scopeChain) {
      if (this.disableForSelectors != null) {
        if (selectorsMatchScopeChain(this.disableForSelectors, scopeChain)) {
          return false;
        }
      }
      if (selectorsMatchScopeChain(this.selectors, scopeChain)) {
        return true;
      } else {
        return false;
      }
    };

    ProviderMetadata.prototype.shouldDisableDefaultProvider = function(scopeChain) {
      if (this.disableDefaultProviderSelectors != null) {
        return selectorsMatchScopeChain(this.disableDefaultProviderSelectors, scopeChain);
      } else {
        return false;
      }
    };

    ProviderMetadata.prototype.getSpecificity = function(scopeChain) {
      var selector;
      if (selector = selectorForScopeChain(this.selectors, scopeChain)) {
        return selector.getSpecificity();
      } else {
        return 0;
      }
    };

    return ProviderMetadata;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlGQUFBOztBQUFBLEVBQUMsV0FBWSxPQUFBLENBQVEsY0FBUixFQUFaLFFBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQW9ELE9BQUEsQ0FBUSxpQkFBUixDQUFwRCxFQUFDLDZCQUFBLHFCQUFELEVBQXdCLGdDQUFBLHdCQUR4QixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsMEJBQUUsUUFBRixFQUFhLFVBQWIsR0FBQTtBQUNYLFVBQUEsd0JBQUE7QUFBQSxNQURZLElBQUMsQ0FBQSxXQUFBLFFBQ2IsQ0FBQTtBQUFBLE1BRHVCLElBQUMsQ0FBQSxhQUFBLFVBQ3hCLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFELEdBQWEsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsSUFBQyxDQUFBLFFBQVEsQ0FBQyxRQUExQixDQUFiLENBQUE7QUFDQSxNQUFBLElBQXdFLHdDQUF4RTtBQUFBLFFBQUEsSUFBQyxDQUFBLG1CQUFELEdBQXVCLFFBQVEsQ0FBQyxNQUFULENBQWdCLElBQUMsQ0FBQSxRQUFRLENBQUMsa0JBQTFCLENBQXZCLENBQUE7T0FEQTtBQUlBLE1BQUEsSUFBRyxpQkFBQSw0REFBaUQsQ0FBQSxpQ0FBQSxVQUFwRDtBQUNFLFFBQUEsSUFBQyxDQUFBLCtCQUFELEdBQW1DLFFBQVEsQ0FBQyxNQUFULENBQWdCLGlCQUFoQixDQUFuQyxDQURGO09BTFc7SUFBQSxDQUFiOztBQUFBLCtCQVFBLGlCQUFBLEdBQW1CLFNBQUMsVUFBRCxHQUFBO0FBQ2pCLE1BQUEsSUFBRyxnQ0FBSDtBQUNFLFFBQUEsSUFBZ0Isd0JBQUEsQ0FBeUIsSUFBQyxDQUFBLG1CQUExQixFQUErQyxVQUEvQyxDQUFoQjtBQUFBLGlCQUFPLEtBQVAsQ0FBQTtTQURGO09BQUE7QUFHQSxNQUFBLElBQUcsd0JBQUEsQ0FBeUIsSUFBQyxDQUFBLFNBQTFCLEVBQXFDLFVBQXJDLENBQUg7ZUFDRSxLQURGO09BQUEsTUFBQTtlQUdFLE1BSEY7T0FKaUI7SUFBQSxDQVJuQixDQUFBOztBQUFBLCtCQWlCQSw0QkFBQSxHQUE4QixTQUFDLFVBQUQsR0FBQTtBQUM1QixNQUFBLElBQUcsNENBQUg7ZUFDRSx3QkFBQSxDQUF5QixJQUFDLENBQUEsK0JBQTFCLEVBQTJELFVBQTNELEVBREY7T0FBQSxNQUFBO2VBR0UsTUFIRjtPQUQ0QjtJQUFBLENBakI5QixDQUFBOztBQUFBLCtCQXVCQSxjQUFBLEdBQWdCLFNBQUMsVUFBRCxHQUFBO0FBQ2QsVUFBQSxRQUFBO0FBQUEsTUFBQSxJQUFHLFFBQUEsR0FBVyxxQkFBQSxDQUFzQixJQUFDLENBQUEsU0FBdkIsRUFBa0MsVUFBbEMsQ0FBZDtlQUNFLFFBQVEsQ0FBQyxjQUFULENBQUEsRUFERjtPQUFBLE1BQUE7ZUFHRSxFQUhGO09BRGM7SUFBQSxDQXZCaEIsQ0FBQTs7NEJBQUE7O01BTEYsQ0FBQTtBQUFBIgp9
//# sourceURL=/home/andrei/dotfiles/atom/packages/autocomplete-plus/lib/provider-metadata.coffee