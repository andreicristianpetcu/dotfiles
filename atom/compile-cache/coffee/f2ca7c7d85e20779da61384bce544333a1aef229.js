(function() {
  var $, $$, OutputView, SelectListMultipleView, SelectStageHunks, fs, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fs = require('fs-plus');

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$;

  git = require('../git');

  OutputView = require('./output-view');

  notifier = require('../notifier');

  SelectListMultipleView = require('./select-list-multiple-view');

  module.exports = SelectStageHunks = (function(_super) {
    __extends(SelectStageHunks, _super);

    function SelectStageHunks() {
      return SelectStageHunks.__super__.constructor.apply(this, arguments);
    }

    SelectStageHunks.prototype.initialize = function(repo, data) {
      this.repo = repo;
      SelectStageHunks.__super__.initialize.apply(this, arguments);
      this.patch_header = data[0];
      if (data.length === 2) {
        return this.completed(this._generateObjects(data.slice(1)));
      }
      this.show();
      this.setItems(this._generateObjects(data.slice(1)));
      return this.focusFilterEditor();
    };

    SelectStageHunks.prototype.getFilterKey = function() {
      return 'pos';
    };

    SelectStageHunks.prototype.addButtons = function() {
      var viewButton;
      viewButton = $$(function() {
        return this.div({
          "class": 'buttons'
        }, (function(_this) {
          return function() {
            _this.span({
              "class": 'pull-left'
            }, function() {
              return _this.button({
                "class": 'btn btn-error inline-block-tight btn-cancel-button'
              }, 'Cancel');
            });
            return _this.span({
              "class": 'pull-right'
            }, function() {
              return _this.button({
                "class": 'btn btn-success inline-block-tight btn-stage-button'
              }, 'Stage');
            });
          };
        })(this));
      });
      viewButton.appendTo(this);
      return this.on('click', 'button', (function(_this) {
        return function(_arg) {
          var target;
          target = _arg.target;
          if ($(target).hasClass('btn-stage-button')) {
            _this.complete();
          }
          if ($(target).hasClass('btn-cancel-button')) {
            return _this.cancel();
          }
        };
      })(this));
    };

    SelectStageHunks.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    SelectStageHunks.prototype.cancelled = function() {
      return this.hide();
    };

    SelectStageHunks.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    SelectStageHunks.prototype.viewForItem = function(item, matchedStr) {
      var viewItem;
      return viewItem = $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'inline-block highlight'
            }, function() {
              if (matchedStr != null) {
                return _this.raw(matchedStr);
              } else {
                return _this.span(item.pos);
              }
            });
            return _this.div({
              "class": 'text-warning gp-item-diff',
              style: 'white-space: pre-wrap; font-family: monospace'
            }, item.diff);
          };
        })(this));
      });
    };

    SelectStageHunks.prototype.completed = function(items) {
      var patch, patchPath, patch_full, _i, _len;
      this.cancel();
      if (items.length < 1) {
        return;
      }
      patch_full = this.patch_header;
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        patch = items[_i].patch;
        patch_full += patch;
      }
      patchPath = this.repo.getWorkingDirectory() + '/GITPLUS_PATCH';
      fs.writeFileSync(patchPath, patch_full, {
        flag: 'w+'
      });
      return git.cmd({
        args: ['apply', '--cached', '--', patchPath],
        cwd: this.repo.getWorkingDirectory(),
        stdout: (function(_this) {
          return function(data) {
            data = (data != null) && data !== '' ? data : 'Hunk has been staged!';
            notifier.addSuccess(data);
            try {
              return fs.unlink(patchPath);
            } catch (_error) {}
          };
        })(this)
      });
    };

    SelectStageHunks.prototype._generateObjects = function(data) {
      var hunk, hunkSplit, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        hunk = data[_i];
        if (!(hunk !== '')) {
          continue;
        }
        hunkSplit = hunk.match(/(@@[ \-\+\,0-9]*@@.*)\n([\s\S]*)/);
        _results.push({
          pos: hunkSplit[1],
          diff: hunkSplit[2],
          patch: hunk
        });
      }
      return _results;
    };

    return SelectStageHunks;

  })(SelectListMultipleView);

}).call(this);
