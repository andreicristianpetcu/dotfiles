(function() {
  var CompositeDisposable, GitCommit, GitPush, Path, fs, git, notifier, os;

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs-plus');

  Path = require('flavored-path');

  os = require('os');

  git = require('../git');

  notifier = require('../notifier');

  GitPush = require('./git-push');

  module.exports = GitCommit = (function() {
    GitCommit.prototype.dir = function() {
      if (this.submodule != null ? this.submodule : this.submodule = git.getSubmodule()) {
        return this.submodule.getWorkingDirectory();
      } else {
        return this.repo.getWorkingDirectory();
      }
    };

    GitCommit.prototype.filePath = function() {
      return Path.join(this.repo.getPath(), 'COMMIT_EDITMSG');
    };

    function GitCommit(repo, _arg) {
      var _ref;
      this.repo = repo;
      _ref = _arg != null ? _arg : {}, this.amend = _ref.amend, this.andPush = _ref.andPush, this.stageChanges = _ref.stageChanges;
      this.currentPane = atom.workspace.getActivePane();
      this.disposables = new CompositeDisposable;
      if (this.amend == null) {
        this.amend = '';
      }
      this.isAmending = this.amend.length > 0;
      this.commentchar = '#';
      git.cmd({
        args: ['config', '--get', 'core.commentchar'],
        stdout: (function(_this) {
          return function(data) {
            if (data.trim() !== '') {
              return _this.commentchar = data.trim();
            }
          };
        })(this)
      });
      if (this.stageChanges) {
        git.add(this.repo, {
          update: true,
          exit: (function(_this) {
            return function(code) {
              return _this.getStagedFiles();
            };
          })(this)
        });
      } else {
        this.getStagedFiles();
      }
    }

    GitCommit.prototype.getStagedFiles = function() {
      return git.stagedFiles(this.repo, (function(_this) {
        return function(files) {
          if (_this.amend !== '' || files.length >= 1) {
            return git.cmd({
              args: ['status'],
              cwd: _this.repo.getWorkingDirectory(),
              stdout: function(data) {
                return _this.prepFile(data);
              }
            });
          } else {
            _this.cleanup();
            return notifier.addInfo('Nothing to commit.');
          }
        };
      })(this));
    };

    GitCommit.prototype.prepFile = function(status) {
      status = status.replace(/\s*\(.*\)\n/g, "\n");
      status = status.trim().replace(/\n/g, "\n" + this.commentchar + " ");
      return this.getTemplate().then((function(_this) {
        return function(template) {
          fs.writeFileSync(_this.filePath(), "" + (_this.amend.length > 0 ? _this.amend : template) + "\n" + _this.commentchar + " Please enter the commit message for your changes. Lines starting\n" + _this.commentchar + " with '" + _this.commentchar + "' will be ignored, and an empty message aborts the commit.\n" + _this.commentchar + "\n" + _this.commentchar + " " + status);
          return _this.showFile();
        };
      })(this));
    };

    GitCommit.prototype.getTemplate = function() {
      return new Promise(function(resolve, reject) {
        return git.cmd({
          args: ['config', '--get', 'commit.template'],
          stdout: (function(_this) {
            return function(data) {
              return resolve((data.trim() !== '' ? fs.readFileSync(Path.get(data.trim())) : ''));
            };
          })(this)
        });
      });
    };

    GitCommit.prototype.showFile = function() {
      return atom.workspace.open(this.filePath(), {
        searchAllPanes: true
      }).done((function(_this) {
        return function(textEditor) {
          if (atom.config.get('git-plus.openInPane')) {
            return _this.splitPane(atom.config.get('git-plus.splitPane'), textEditor);
          } else {
            _this.disposables.add(textEditor.onDidSave(function() {
              return _this.commit();
            }));
            return _this.disposables.add(textEditor.onDidDestroy(function() {
              if (_this.isAmending) {
                return _this.undoAmend();
              } else {
                return _this.cleanup();
              }
            }));
          }
        };
      })(this));
    };

    GitCommit.prototype.splitPane = function(splitDir, oldEditor) {
      var directions, hookEvents, options, pane;
      pane = atom.workspace.paneForURI(this.filePath());
      options = {
        copyActiveItem: true
      };
      hookEvents = (function(_this) {
        return function(textEditor) {
          oldEditor.destroy();
          _this.disposables.add(textEditor.onDidSave(function() {
            return _this.commit();
          }));
          return _this.disposables.add(textEditor.onDidDestroy(function() {
            if (_this.isAmending) {
              return _this.undoAmend();
            } else {
              return _this.cleanup();
            }
          }));
        };
      })(this);
      directions = {
        left: (function(_this) {
          return function() {
            pane = pane.splitLeft(options);
            return hookEvents(pane.getActiveEditor());
          };
        })(this),
        right: function() {
          pane = pane.splitRight(options);
          return hookEvents(pane.getActiveEditor());
        },
        up: function() {
          pane = pane.splitUp(options);
          return hookEvents(pane.getActiveEditor());
        },
        down: function() {
          pane = pane.splitDown(options);
          return hookEvents(pane.getActiveEditor());
        }
      };
      return directions[splitDir]();
    };

    GitCommit.prototype.commit = function() {
      var args;
      args = ['commit', '--cleanup=strip', "--file=" + (this.filePath())];
      return git.cmd({
        args: args,
        options: {
          cwd: this.dir()
        },
        stdout: (function(_this) {
          return function(data) {
            notifier.addSuccess(data);
            if (_this.andPush) {
              new GitPush(_this.repo);
            }
            _this.isAmending = false;
            _this.destroyCommitEditor();
            if (_this.currentPane.alive) {
              _this.currentPane.activate();
            }
            return git.refresh();
          };
        })(this),
        stderr: (function(_this) {
          return function(err) {
            return _this.destroyCommitEditor();
          };
        })(this)
      });
    };

    GitCommit.prototype.destroyCommitEditor = function() {
      this.cleanup();
      return atom.workspace.getPanes().some(function(pane) {
        return pane.getItems().some(function(paneItem) {
          var _ref;
          if (paneItem != null ? typeof paneItem.getURI === "function" ? (_ref = paneItem.getURI()) != null ? _ref.includes('COMMIT_EDITMSG') : void 0 : void 0 : void 0) {
            if (pane.getItems().length === 1) {
              pane.destroy();
            } else {
              paneItem.destroy();
            }
            return true;
          }
        });
      });
    };

    GitCommit.prototype.undoAmend = function(err) {
      if (err == null) {
        err = '';
      }
      return git.cmd({
        args: ['reset', 'ORIG_HEAD'],
        stdout: function() {
          return notifier.addError("" + err + ": Commit amend aborted!");
        },
        stderr: function() {
          return notifier.addError('ERROR! Undoing the amend failed! Please fix your repository manually!');
        },
        exit: (function(_this) {
          return function() {
            _this.isAmending = false;
            return _this.destroyCommitEditor();
          };
        })(this)
      });
    };

    GitCommit.prototype.cleanup = function() {
      if (this.currentPane.alive) {
        this.currentPane.activate();
      }
      this.disposables.dispose();
      try {
        return fs.unlinkSync(this.filePath());
      } catch (_error) {}
    };

    return GitCommit;

  })();

}).call(this);
