(function() {
  var CompositeDisposable, Disposable, FuzzyProvider, ProviderManager, ProviderMetadata, Selector, SymbolProvider, grim, isFunction, isString, scopeChainForScopeDescriptor, selectorsMatchScopeChain, semver, stableSort, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  _ref1 = require('./type-helpers'), isFunction = _ref1.isFunction, isString = _ref1.isString;

  semver = require('semver');

  Selector = require('selector-kit').Selector;

  stableSort = require('stable');

  selectorsMatchScopeChain = require('./scope-helpers').selectorsMatchScopeChain;

  SymbolProvider = null;

  FuzzyProvider = null;

  grim = null;

  ProviderMetadata = null;

  module.exports = ProviderManager = (function() {
    ProviderManager.prototype.defaultProvider = null;

    ProviderManager.prototype.defaultProviderRegistration = null;

    ProviderManager.prototype.providers = null;

    ProviderManager.prototype.store = null;

    ProviderManager.prototype.subscriptions = null;

    ProviderManager.prototype.globalBlacklist = null;

    function ProviderManager() {
      this.registerProvider = __bind(this.registerProvider, this);
      this.removeProvider = __bind(this.removeProvider, this);
      this.addProvider = __bind(this.addProvider, this);
      this.apiVersionForProvider = __bind(this.apiVersionForProvider, this);
      this.metadataForProvider = __bind(this.metadataForProvider, this);
      this.setGlobalBlacklist = __bind(this.setGlobalBlacklist, this);
      this.toggleDefaultProvider = __bind(this.toggleDefaultProvider, this);
      this.providersForScopeDescriptor = __bind(this.providersForScopeDescriptor, this);
      this.subscriptions = new CompositeDisposable;
      this.globalBlacklist = new CompositeDisposable;
      this.subscriptions.add(this.globalBlacklist);
      this.providers = [];
      this.subscriptions.add(atom.config.observe('autocomplete-plus.enableBuiltinProvider', (function(_this) {
        return function(value) {
          return _this.toggleDefaultProvider(value);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('autocomplete-plus.scopeBlacklist', (function(_this) {
        return function(value) {
          return _this.setGlobalBlacklist(value);
        };
      })(this)));
    }

    ProviderManager.prototype.dispose = function() {
      var _ref2;
      this.toggleDefaultProvider(false);
      if ((_ref2 = this.subscriptions) != null) {
        _ref2.dispose();
      }
      this.subscriptions = null;
      this.globalBlacklist = null;
      return this.providers = null;
    };

    ProviderManager.prototype.providersForScopeDescriptor = function(scopeDescriptor) {
      var disableDefaultProvider, index, lowestIncludedPriority, matchingProviders, provider, providerMetadata, scopeChain, _i, _len, _ref2, _ref3;
      scopeChain = scopeChainForScopeDescriptor(scopeDescriptor);
      if (!scopeChain) {
        return [];
      }
      if ((this.globalBlacklistSelectors != null) && selectorsMatchScopeChain(this.globalBlacklistSelectors, scopeChain)) {
        return [];
      }
      matchingProviders = [];
      disableDefaultProvider = false;
      lowestIncludedPriority = 0;
      _ref2 = this.providers;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        providerMetadata = _ref2[_i];
        provider = providerMetadata.provider;
        if (providerMetadata.matchesScopeChain(scopeChain)) {
          matchingProviders.push(provider);
          if (provider.excludeLowerPriority) {
            lowestIncludedPriority = Math.max(lowestIncludedPriority, (_ref3 = provider.inclusionPriority) != null ? _ref3 : 0);
          }
          if (providerMetadata.shouldDisableDefaultProvider(scopeChain)) {
            disableDefaultProvider = true;
          }
        }
      }
      if (disableDefaultProvider) {
        index = matchingProviders.indexOf(this.defaultProvider);
        if (index > -1) {
          matchingProviders.splice(index, 1);
        }
      }
      matchingProviders = (function() {
        var _j, _len1, _ref4, _results;
        _results = [];
        for (_j = 0, _len1 = matchingProviders.length; _j < _len1; _j++) {
          provider = matchingProviders[_j];
          if (((_ref4 = provider.inclusionPriority) != null ? _ref4 : 0) >= lowestIncludedPriority) {
            _results.push(provider);
          }
        }
        return _results;
      })();
      return stableSort(matchingProviders, (function(_this) {
        return function(providerA, providerB) {
          var difference, specificityA, specificityB, _ref4, _ref5;
          difference = ((_ref4 = providerB.suggestionPriority) != null ? _ref4 : 1) - ((_ref5 = providerA.suggestionPriority) != null ? _ref5 : 1);
          if (difference === 0) {
            specificityA = _this.metadataForProvider(providerA).getSpecificity(scopeChain);
            specificityB = _this.metadataForProvider(providerB).getSpecificity(scopeChain);
            difference = specificityB - specificityA;
          }
          return difference;
        };
      })(this));
    };

    ProviderManager.prototype.toggleDefaultProvider = function(enabled) {
      var _ref2, _ref3;
      if (enabled == null) {
        return;
      }
      if (enabled) {
        if ((this.defaultProvider != null) || (this.defaultProviderRegistration != null)) {
          return;
        }
        if (atom.config.get('autocomplete-plus.defaultProvider') === 'Symbol') {
          if (SymbolProvider == null) {
            SymbolProvider = require('./symbol-provider');
          }
          this.defaultProvider = new SymbolProvider();
        } else {
          if (FuzzyProvider == null) {
            FuzzyProvider = require('./fuzzy-provider');
          }
          this.defaultProvider = new FuzzyProvider();
        }
        return this.defaultProviderRegistration = this.registerProvider(this.defaultProvider);
      } else {
        if ((_ref2 = this.defaultProviderRegistration) != null) {
          _ref2.dispose();
        }
        if ((_ref3 = this.defaultProvider) != null) {
          _ref3.dispose();
        }
        this.defaultProviderRegistration = null;
        return this.defaultProvider = null;
      }
    };

    ProviderManager.prototype.setGlobalBlacklist = function(globalBlacklist) {
      this.globalBlacklistSelectors = null;
      if (globalBlacklist != null ? globalBlacklist.length : void 0) {
        return this.globalBlacklistSelectors = Selector.create(globalBlacklist);
      }
    };

    ProviderManager.prototype.isValidProvider = function(provider, apiVersion) {
      if (semver.satisfies(apiVersion, '>=2.0.0')) {
        return (provider != null) && isFunction(provider.getSuggestions) && isString(provider.selector) && !!provider.selector.length;
      } else {
        return (provider != null) && isFunction(provider.requestHandler) && isString(provider.selector) && !!provider.selector.length;
      }
    };

    ProviderManager.prototype.metadataForProvider = function(provider) {
      var providerMetadata, _i, _len, _ref2;
      _ref2 = this.providers;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        providerMetadata = _ref2[_i];
        if (providerMetadata.provider === provider) {
          return providerMetadata;
        }
      }
      return null;
    };

    ProviderManager.prototype.apiVersionForProvider = function(provider) {
      var _ref2;
      return (_ref2 = this.metadataForProvider(provider)) != null ? _ref2.apiVersion : void 0;
    };

    ProviderManager.prototype.isProviderRegistered = function(provider) {
      return this.metadataForProvider(provider) != null;
    };

    ProviderManager.prototype.addProvider = function(provider, apiVersion) {
      if (apiVersion == null) {
        apiVersion = '2.0.0';
      }
      if (this.isProviderRegistered(provider)) {
        return;
      }
      if (ProviderMetadata == null) {
        ProviderMetadata = require('./provider-metadata');
      }
      this.providers.push(new ProviderMetadata(provider, apiVersion));
      if (provider.dispose != null) {
        return this.subscriptions.add(provider);
      }
    };

    ProviderManager.prototype.removeProvider = function(provider) {
      var i, providerMetadata, _i, _len, _ref2, _ref3;
      if (!this.providers) {
        return;
      }
      _ref2 = this.providers;
      for (i = _i = 0, _len = _ref2.length; _i < _len; i = ++_i) {
        providerMetadata = _ref2[i];
        if (providerMetadata.provider === provider) {
          this.providers.splice(i, 1);
          break;
        }
      }
      if (provider.dispose != null) {
        return (_ref3 = this.subscriptions) != null ? _ref3.remove(provider) : void 0;
      }
    };

    ProviderManager.prototype.registerProvider = function(provider, apiVersion) {
      var apiIs20, disposable, originalDispose;
      if (apiVersion == null) {
        apiVersion = '2.0.0';
      }
      if (provider == null) {
        return;
      }
      apiIs20 = semver.satisfies(apiVersion, '>=2.0.0');
      if (apiIs20) {
        if ((provider.id != null) && provider !== this.defaultProvider) {
          if (grim == null) {
            grim = require('grim');
          }
          grim.deprecate("Autocomplete provider '" + provider.constructor.name + "(" + provider.id + ")'\ncontains an `id` property.\nAn `id` attribute on your provider is no longer necessary.\nSee https://github.com/atom/autocomplete-plus/wiki/Provider-API");
        }
        if (provider.requestHandler != null) {
          if (grim == null) {
            grim = require('grim');
          }
          grim.deprecate("Autocomplete provider '" + provider.constructor.name + "(" + provider.id + ")'\ncontains a `requestHandler` property.\n`requestHandler` has been renamed to `getSuggestions`.\nSee https://github.com/atom/autocomplete-plus/wiki/Provider-API");
        }
        if (provider.blacklist != null) {
          if (grim == null) {
            grim = require('grim');
          }
          grim.deprecate("Autocomplete provider '" + provider.constructor.name + "(" + provider.id + ")'\ncontains a `blacklist` property.\n`blacklist` has been renamed to `disableForSelector`.\nSee https://github.com/atom/autocomplete-plus/wiki/Provider-API");
        }
      }
      if (!this.isValidProvider(provider, apiVersion)) {
        console.warn("Provider " + provider.constructor.name + " is not valid", provider);
        return new Disposable();
      }
      if (this.isProviderRegistered(provider)) {
        return;
      }
      this.addProvider(provider, apiVersion);
      disposable = new Disposable((function(_this) {
        return function() {
          return _this.removeProvider(provider);
        };
      })(this));
      if (originalDispose = provider.dispose) {
        provider.dispose = function() {
          originalDispose.call(provider);
          return disposable.dispose();
        };
      }
      return disposable;
    };

    return ProviderManager;

  })();

  scopeChainForScopeDescriptor = function(scopeDescriptor) {
    var json, scopeChain, type;
    type = typeof scopeDescriptor;
    if (type === 'string') {
      return scopeDescriptor;
    } else if (type === 'object' && ((scopeDescriptor != null ? scopeDescriptor.getScopeChain : void 0) != null)) {
      scopeChain = scopeDescriptor.getScopeChain();
      if ((scopeChain != null) && (scopeChain.replace == null)) {
        json = JSON.stringify(scopeDescriptor);
        console.log(scopeDescriptor, json);
        throw new Error("01: ScopeChain is not correct type: " + type + "; " + json);
      }
      return scopeChain;
    } else {
      json = JSON.stringify(scopeDescriptor);
      console.log(scopeDescriptor, json);
      throw new Error("02: ScopeChain is not correct type: " + type + "; " + json);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdPQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxPQUFvQyxPQUFBLENBQVEsTUFBUixDQUFwQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGtCQUFBLFVBQXRCLENBQUE7O0FBQUEsRUFDQSxRQUF5QixPQUFBLENBQVEsZ0JBQVIsQ0FBekIsRUFBQyxtQkFBQSxVQUFELEVBQWEsaUJBQUEsUUFEYixDQUFBOztBQUFBLEVBRUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBRlQsQ0FBQTs7QUFBQSxFQUdDLFdBQVksT0FBQSxDQUFRLGNBQVIsRUFBWixRQUhELENBQUE7O0FBQUEsRUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLFFBQVIsQ0FKYixDQUFBOztBQUFBLEVBTUMsMkJBQTRCLE9BQUEsQ0FBUSxpQkFBUixFQUE1Qix3QkFORCxDQUFBOztBQUFBLEVBU0EsY0FBQSxHQUFpQixJQVRqQixDQUFBOztBQUFBLEVBVUEsYUFBQSxHQUFpQixJQVZqQixDQUFBOztBQUFBLEVBV0EsSUFBQSxHQUFPLElBWFAsQ0FBQTs7QUFBQSxFQVlBLGdCQUFBLEdBQW1CLElBWm5CLENBQUE7O0FBQUEsRUFjQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osOEJBQUEsZUFBQSxHQUFpQixJQUFqQixDQUFBOztBQUFBLDhCQUNBLDJCQUFBLEdBQTZCLElBRDdCLENBQUE7O0FBQUEsOEJBRUEsU0FBQSxHQUFXLElBRlgsQ0FBQTs7QUFBQSw4QkFHQSxLQUFBLEdBQU8sSUFIUCxDQUFBOztBQUFBLDhCQUlBLGFBQUEsR0FBZSxJQUpmLENBQUE7O0FBQUEsOEJBS0EsZUFBQSxHQUFpQixJQUxqQixDQUFBOztBQU9hLElBQUEseUJBQUEsR0FBQTtBQUNYLGlFQUFBLENBQUE7QUFBQSw2REFBQSxDQUFBO0FB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
//# sourceURL=/home/andrei/dotfiles/atom/packages/autocomplete-plus/lib/provider-manager.coffee