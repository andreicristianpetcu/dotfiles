(function() {
  var $$, GitDiff, Path, SelectListView, StatusListView, fs, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  fs = require('fs');

  Path = require('path');

  git = require('../git');

  GitDiff = require('../models/git-diff');

  notifier = require('../notifier');

  module.exports = StatusListView = (function(_super) {
    __extends(StatusListView, _super);

    function StatusListView() {
      return StatusListView.__super__.constructor.apply(this, arguments);
    }

    StatusListView.prototype.initialize = function(repo, data, _arg) {
      this.repo = repo;
      this.data = data;
      this.onlyCurrentFile = (_arg != null ? _arg : {}).onlyCurrentFile;
      StatusListView.__super__.initialize.apply(this, arguments);
      this.show();
      this.branch = this.data[0];
      this.setItems(this.parseData(this.data.slice(0, -1)));
      return this.focusFilterEditor();
    };

    StatusListView.prototype.parseData = function(files) {
      var line, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        line = files[_i];
        if (!(/^([ MADRCU?!]{2})\s{1}(.*)/.test(line))) {
          continue;
        }
        line = line.match(/^([ MADRCU?!]{2})\s{1}(.*)/);
        _results.push({
          type: line[1],
          path: line[2]
        });
      }
      return _results;
    };

    StatusListView.prototype.getFilterKey = function() {
      return 'path';
    };

    StatusListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    StatusListView.prototype.cancelled = function() {
      return this.hide();
    };

    StatusListView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    StatusListView.prototype.viewForItem = function(_arg) {
      var getIcon, path, type;
      type = _arg.type, path = _arg.path;
      getIcon = function(s) {
        if (s[0] === 'A') {
          return 'status-added icon icon-diff-added';
        }
        if (s[0] === 'D') {
          return 'status-removed icon icon-diff-removed';
        }
        if (s[0] === 'R') {
          return 'status-renamed icon icon-diff-renamed';
        }
        if (s[0] === 'M' || s[1] === 'M') {
          return 'status-modified icon icon-diff-modified';
        }
        return '';
      };
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'pull-right highlight',
              style: 'white-space: pre-wrap; font-family: monospace'
            }, type);
            _this.span({
              "class": getIcon(type)
            });
            return _this.span(path);
          };
        })(this));
      });
    };

    StatusListView.prototype.confirmed = function(_arg) {
      var fullPath, openFile, path, type;
      type = _arg.type, path = _arg.path;
      this.cancel();
      if (type === '??') {
        return git.add(this.repo, {
          file: path
        });
      } else {
        openFile = confirm("Open " + path + "?");
        fullPath = Path.join(this.repo.getWorkingDirectory(), path);
        return fs.stat(fullPath, (function(_this) {
          return function(err, stat) {
            var isDirectory;
            if (err) {
              return notifier.addError(err.message);
            } else {
              isDirectory = stat != null ? stat.isDirectory() : void 0;
              if (openFile) {
                if (isDirectory) {
                  return atom.open({
                    pathsToOpen: fullPath,
                    newWindow: true
                  });
                } else {
                  return atom.workspace.open(fullPath);
                }
              } else {
                return GitDiff(_this.repo, {
                  file: path
                });
              }
            }
          };
        })(this));
      }
    };

    return StatusListView;

  })(SelectListView);

}).call(this);
