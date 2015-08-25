(function() {
  module.exports = {
    provider: null,
    ready: false,
    activate: function() {
      return this.ready = true;
    },
    deactivate: function() {
      return this.provider = null;
    },
    getProvider: function() {
      var PathsProvider;
      if (this.provider != null) {
        return this.provider;
      }
      PathsProvider = require('./paths-provider');
      this.provider = new PathsProvider();
      return this.provider;
    },
    provide: function() {
      return {
        provider: this.getProvider()
      };
    }
  };

}).call(this);
