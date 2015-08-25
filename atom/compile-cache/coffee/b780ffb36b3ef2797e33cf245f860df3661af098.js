(function() {
  var TagGenerator, ctags, fs, getTagsFile, matchOpt, path;

  TagGenerator = require('./tag-generator');

  ctags = require('ctags');

  fs = require("fs");

  path = require("path");

  getTagsFile = function(directoryPath) {
    var tagsFile;
    tagsFile = path.join(directoryPath, ".tags");
    if (fs.existsSync(tagsFile)) {
      return tagsFile;
    }
  };

  matchOpt = {
    matchBase: true
  };

  module.exports = {
    activate: function() {
      this.cachedTags = {};
      return this.extraTags = {};
    },
    deactivate: function() {
      return this.cachedTags = null;
    },
    initTags: function(paths, auto) {
      var p, tagsFile, _i, _len, _results;
      if (paths.length === 0) {
        return;
      }
      this.cachedTags = {};
      _results = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        p = paths[_i];
        tagsFile = getTagsFile(p);
        if (tagsFile) {
          _results.push(this.readTags(tagsFile, this.cachedTags));
        } else {
          if (auto) {
            _results.push(this.generateTags(p));
          } else {
            _results.push(void 0);
          }
        }
      }
      return _results;
    },
    initExtraTags: function(paths) {
      var p, _i, _len, _results;
      this.extraTags = {};
      _results = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        p = paths[_i];
        p = p.trim();
        if (!p) {
          continue;
        }
        _results.push(this.readTags(p, this.extraTags));
      }
      return _results;
    },
    readTags: function(p, container, callback) {
      var startTime, stream;
      console.log("[atom-ctags:readTags] " + p + " start...");
      startTime = Date.now();
      stream = ctags.createReadStream(p);
      stream.on('error', function(error) {
        return console.error('atom-ctags: ', error);
      });
      stream.on('data', function(tags) {
        var data, tag, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = tags.length; _i < _len; _i++) {
          tag = tags[_i];
          data = container[tag.file];
          if (!data) {
            data = [];
            container[tag.file] = data;
          }
          _results.push(data.push(tag));
        }
        return _results;
      });
      return stream.on('end', function() {
        console.log("[atom-ctags:readTags] " + p + " cost: " + (Date.now() - startTime) + "ms");
        return typeof callback === "function" ? callback() : void 0;
      });
    },
    findTags: function(prefix, options) {
      var tags;
      tags = [];
      if (this.findOf(this.cachedTags, tags, prefix, options)) {
        return tags;
      }
      if (this.findOf(this.extraTags, tags, prefix, options)) {
        return tags;
      }
      if (tags.length === 0) {
        console.warn("[atom-ctags:findTags] tags empty, did you RebuildTags or set extraTagFiles?");
      }
      return tags;
    },
    findOf: function(source, tags, prefix, options) {
      var key, tag, value, _i, _len;
      for (key in source) {
        value = source[key];
        for (_i = 0, _len = value.length; _i < _len; _i++) {
          tag = value[_i];
          if ((options != null ? options.partialMatch : void 0) && tag.name.indexOf(prefix) === 0) {
            tags.push(tag);
          } else if (tag.name === prefix) {
            tags.push(tag);
          }
          if ((options != null ? options.maxItems : void 0) && tags.length === options.maxItems) {
            return true;
          }
        }
      }
      return false;
    },
    generateTags: function(p, isAppend, callback) {
      var cmdArgs, startTime;
      delete this.cachedTags[p];
      startTime = Date.now();
      console.log("[atom-ctags:rebuild] start @" + p + "@ tags...");
      cmdArgs = atom.config.get("atom-ctags.cmdArgs");
      if (cmdArgs) {
        cmdArgs = cmdArgs.split(" ");
      }
      return TagGenerator(p, isAppend, this.cmdArgs || cmdArgs, (function(_this) {
        return function(tagpath) {
          console.log("[atom-ctags:rebuild] command done @" + p + "@ tags. cost: " + (Date.now() - startTime) + "ms");
          startTime = Date.now();
          return _this.readTags(tagpath, _this.cachedTags, callback);
        };
      })(this));
    },
    getOrCreateTags: function(filePath, callback) {
      var tags;
      tags = this.cachedTags[filePath];
      if (tags) {
        return typeof callback === "function" ? callback(tags) : void 0;
      }
      return this.generateTags(filePath, true, (function(_this) {
        return function() {
          tags = _this.cachedTags[filePath];
          return typeof callback === "function" ? callback(tags) : void 0;
        };
      })(this));
    }
  };

}).call(this);
