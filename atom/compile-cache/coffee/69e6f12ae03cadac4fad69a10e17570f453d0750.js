(function() {
  var $, $$$, BufferedProcess, Disposable, GitShow, LogListView, ScrollView, amountOfCommitsToShow, git, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Disposable = require('atom').Disposable;

  BufferedProcess = require('atom').BufferedProcess;

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$$ = _ref.$$$, ScrollView = _ref.ScrollView;

  git = require('../git');

  GitShow = require('../models/git-show');

  amountOfCommitsToShow = function() {
    return atom.config.get('git-plus.amountOfCommitsToShow');
  };

  module.exports = LogListView = (function(_super) {
    __extends(LogListView, _super);

    function LogListView() {
      return LogListView.__super__.constructor.apply(this, arguments);
    }

    LogListView.content = function() {
      return this.div({
        "class": 'git-plus-log native-key-bindings',
        tabindex: -1
      }, (function(_this) {
        return function() {
          return _this.table({
            id: 'git-plus-commits',
            outlet: 'commitsListView'
          });
        };
      })(this));
    };

    LogListView.prototype.onDidChangeTitle = function() {
      return new Disposable;
    };

    LogListView.prototype.onDidChangeModified = function() {
      return new Disposable;
    };

    LogListView.prototype.getURI = function() {
      return 'atom://git-plus:log';
    };

    LogListView.prototype.getTitle = function() {
      return 'git-plus: Log';
    };

    LogListView.prototype.initialize = function() {
      LogListView.__super__.initialize.apply(this, arguments);
      this.skipCommits = 0;
      this.on('click', '.commit-row', (function(_this) {
        return function(_arg) {
          var currentTarget;
          currentTarget = _arg.currentTarget;
          return _this.showCommitLog(currentTarget.getAttribute('hash'));
        };
      })(this));
      return this.scroll((function(_this) {
        return function() {
          if (_this.scrollTop() + _this.height() === _this.prop('scrollHeight')) {
            return _this.getLog();
          }
        };
      })(this));
    };

    LogListView.prototype.setRepo = function(repo) {
      this.repo = repo;
    };

    LogListView.prototype.parseData = function(data) {
      var commits, newline, separator;
      if (data.length > 0) {
        separator = ';|';
        newline = '_.;._';
        data = data.substring(0, data.length - newline.length - 1);
        commits = data.split(newline).map(function(line) {
          var tmpData;
          if (line.trim() !== '') {
            tmpData = line.trim().split(separator);
            return {
              hashShort: tmpData[0],
              hash: tmpData[1],
              author: tmpData[2],
              email: tmpData[3],
              message: tmpData[4],
              date: tmpData[5]
            };
          }
        });
        return this.renderLog(commits);
      }
    };

    LogListView.prototype.renderHeader = function() {
      var headerRow;
      headerRow = $$$(function() {
        return this.tr({
          "class": 'commit-header'
        }, (function(_this) {
          return function() {
            _this.td('Date');
            _this.td('Message');
            return _this.td({
              "class": 'hashShort'
            }, 'Short Hash');
          };
        })(this));
      });
      return this.commitsListView.append(headerRow);
    };

    LogListView.prototype.renderLog = function(commits) {
      commits.forEach((function(_this) {
        return function(commit) {
          return _this.renderCommit(commit);
        };
      })(this));
      return this.skipCommits += amountOfCommitsToShow();
    };

    LogListView.prototype.renderCommit = function(commit) {
      var commitRow;
      commitRow = $$$(function() {
        return this.tr({
          "class": 'commit-row',
          hash: "" + commit.hash
        }, (function(_this) {
          return function() {
            _this.td({
              "class": 'date'
            }, "" + commit.date + " by " + commit.author);
            _this.td({
              "class": 'message'
            }, "" + commit.message);
            return _this.td({
              "class": 'hashShort'
            }, "" + commit.hashShort);
          };
        })(this));
      });
      return this.commitsListView.append(commitRow);
    };

    LogListView.prototype.showCommitLog = function(hash) {
      return GitShow(this.repo, hash, this.onlyCurrentFile ? this.currentFile : void 0);
    };

    LogListView.prototype.branchLog = function() {
      this.skipCommits = 0;
      this.commitsListView.empty();
      this.onlyCurrentFile = false;
      this.currentFile = null;
      this.renderHeader();
      return this.getLog();
    };

    LogListView.prototype.currentFileLog = function(onlyCurrentFile, currentFile) {
      this.onlyCurrentFile = onlyCurrentFile;
      this.currentFile = currentFile;
      this.skipCommits = 0;
      this.commitsListView.empty();
      this.renderHeader();
      return this.getLog();
    };

    LogListView.prototype.getLog = function() {
      var args;
      args = ['log', "--pretty=%h;|%H;|%aN;|%aE;|%s;|%ai_.;._", "-" + (amountOfCommitsToShow()), '--skip=' + this.skipCommits];
      if (this.onlyCurrentFile && (this.currentFile != null)) {
        args.push(this.currentFile);
      }
      return git.cmd({
        args: args,
        cwd: this.repo.getWorkingDirectory(),
        stdout: (function(_this) {
          return function(data) {
            return _this.parseData(data);
          };
        })(this)
      });
    };

    return LogListView;

  })(ScrollView);

}).call(this);
