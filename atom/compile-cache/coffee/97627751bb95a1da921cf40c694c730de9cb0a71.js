(function() {
  var Tags, es;

  Tags = require(process.resourcesPath + '/app.asar.unpacked/node_modules/symbols-view/node_modules/ctags/build/Release/ctags.node').Tags;

  es = require('event-stream');

  exports.findTags = function(tagsFilePath, tag, options, callback) {
    var caseInsensitive, partialMatch, tagsWrapper, _ref;
    if (typeof tagsFilePath !== 'string') {
      throw new TypeError('tagsFilePath must be a string');
    }
    if (typeof tag !== 'string') {
      throw new TypeError('tag must be a string');
    }
    if (typeof options === 'function') {
      callback = options;
      options = null;
    }
    _ref = options != null ? options : {}, partialMatch = _ref.partialMatch, caseInsensitive = _ref.caseInsensitive;
    tagsWrapper = new Tags(tagsFilePath);
    tagsWrapper.findTags(tag, partialMatch, caseInsensitive, function(error, tags) {
      tagsWrapper.end();
      return typeof callback === "function" ? callback(error, tags) : void 0;
    });
    return void 0;
  };

  exports.createReadStream = function(tagsFilePath, options) {
    var chunkSize, tagsWrapper;
    if (options == null) {
      options = {};
    }
    if (typeof tagsFilePath !== 'string') {
      throw new TypeError('tagsFilePath must be a string');
    }
    chunkSize = options.chunkSize;
    if (typeof chunkSize !== 'number') {
      chunkSize = 100;
    }
    tagsWrapper = new Tags(tagsFilePath);
    return es.readable(function(count, callback) {
      if (!tagsWrapper.exists()) {
        return callback(new Error("Tags file could not be opened: " + tagsFilePath));
      }
      return tagsWrapper.getTags(chunkSize, (function(_this) {
        return function(error, tags) {
          if ((error != null) || tags.length === 0) {
            tagsWrapper.end();
          }
          callback(error, tags);
          if ((error != null) || tags.length === 0) {
            return _this.emit('end');
          }
        };
      })(this));
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFFBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxPQUFPLENBQUMsYUFBUixHQUF3QiwwRkFBaEMsRUFBUixJQUFELENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLGNBQVIsQ0FETCxDQUFBOztBQUFBLEVBR0EsT0FBTyxDQUFDLFFBQVIsR0FBbUIsU0FBQyxZQUFELEVBQWUsR0FBZixFQUFvQixPQUFwQixFQUE2QixRQUE3QixHQUFBO0FBQ2pCLFFBQUEsZ0RBQUE7QUFBQSxJQUFBLElBQU8sTUFBQSxDQUFBLFlBQUEsS0FBdUIsUUFBOUI7QUFDRSxZQUFVLElBQUEsU0FBQSxDQUFVLCtCQUFWLENBQVYsQ0FERjtLQUFBO0FBR0EsSUFBQSxJQUFPLE1BQUEsQ0FBQSxHQUFBLEtBQWMsUUFBckI7QUFDRSxZQUFVLElBQUEsU0FBQSxDQUFVLHNCQUFWLENBQVYsQ0FERjtLQUhBO0FBTUEsSUFBQSxJQUFHLE1BQUEsQ0FBQSxPQUFBLEtBQWtCLFVBQXJCO0FBQ0UsTUFBQSxRQUFBLEdBQVcsT0FBWCxDQUFBO0FBQUEsTUFDQSxPQUFBLEdBQVUsSUFEVixDQURGO0tBTkE7QUFBQSxJQVVBLHlCQUFrQyxVQUFVLEVBQTVDLEVBQUMsb0JBQUEsWUFBRCxFQUFlLHVCQUFBLGVBVmYsQ0FBQTtBQUFBLElBWUEsV0FBQSxHQUFrQixJQUFBLElBQUEsQ0FBSyxZQUFMLENBWmxCLENBQUE7QUFBQSxJQWFBLFdBQVcsQ0FBQyxRQUFaLENBQXFCLEdBQXJCLEVBQTBCLFlBQTFCLEVBQXdDLGVBQXhDLEVBQXlELFNBQUMsS0FBRCxFQUFRLElBQVIsR0FBQTtBQUN2RCxNQUFBLFdBQVcsQ0FBQyxHQUFaLENBQUEsQ0FBQSxDQUFBOzhDQUNBLFNBQVUsT0FBTyxlQUZzQztJQUFBLENBQXpELENBYkEsQ0FBQTtXQWlCQSxPQWxCaUI7RUFBQSxDQUhuQixDQUFBOztBQUFBLEVBdUJBLE9BQU8sQ0FBQyxnQkFBUixHQUEyQixTQUFDLFlBQUQsRUFBZSxPQUFmLEdBQUE7QUFDekIsUUFBQSxzQkFBQTs7TUFEd0MsVUFBUTtLQUNoRDtBQUFBLElBQUEsSUFBTyxNQUFBLENBQUEsWUFBQSxLQUF1QixRQUE5QjtBQUNFLFlBQVUsSUFBQSxTQUFBLENBQVUsK0JBQVYsQ0FBVixDQURGO0tBQUE7QUFBQSxJQUdDLFlBQWEsUUFBYixTQUhELENBQUE7QUFJQSxJQUFBLElBQW1CLE1BQUEsQ0FBQSxTQUFBLEtBQXNCLFFBQXpDO0FBQUEsTUFBQSxTQUFBLEdBQVksR0FBWixDQUFBO0tBSkE7QUFBQSxJQU1BLFdBQUEsR0FBa0IsSUFBQSxJQUFBLENBQUssWUFBTCxDQU5sQixDQUFBO1dBT0EsRUFBRSxDQUFDLFFBQUgsQ0FBWSxTQUFDLEtBQUQsRUFBUSxRQUFSLEdBQUE7QUFDVixNQUFBLElBQUEsQ0FBQSxXQUFrQixDQUFDLE1BQVosQ0FBQSxDQUFQO0FBQ0UsZUFBTyxRQUFBLENBQWEsSUFBQSxLQUFBLENBQU8saUNBQUEsR0FBaUMsWUFBeEMsQ0FBYixDQUFQLENBREY7T0FBQTthQUdBLFdBQVcsQ0FBQyxPQUFaLENBQW9CLFNBQXBCLEVBQStCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsRUFBUSxJQUFSLEdBQUE7QUFDN0IsVUFBQSxJQUFxQixlQUFBLElBQVUsSUFBSSxDQUFDLE1BQUwsS0FBZSxDQUE5QztBQUFBLFlBQUEsV0FBVyxDQUFDLEdBQVosQ0FBQSxDQUFBLENBQUE7V0FBQTtBQUFBLFVBQ0EsUUFBQSxDQUFTLEtBQVQsRUFBZ0IsSUFBaEIsQ0FEQSxDQUFBO0FBRUEsVUFBQSxJQUFnQixlQUFBLElBQVUsSUFBSSxDQUFDLE1BQUwsS0FBZSxDQUF6QzttQkFBQSxLQUFDLENBQUEsSUFBRCxDQUFNLEtBQU4sRUFBQTtXQUg2QjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQS9CLEVBSlU7SUFBQSxDQUFaLEVBUnlCO0VBQUEsQ0F2QjNCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/home/andrei/.atom/packages/atom-ctags/node_modules/ctags/src/ctags.coffee