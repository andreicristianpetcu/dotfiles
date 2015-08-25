(function() {
  var CompositeDisposable, GitAdd, GitAddAllAndCommit, GitAddAllCommitAndPush, GitAddAndCommit, GitBranch, GitCheckoutAllFiles, GitCheckoutCurrentFile, GitCherryPick, GitCommit, GitCommitAmend, GitDeleteLocalBranch, GitDeleteRemoteBranch, GitDiff, GitDiffAll, GitFetch, GitFetchPrune, GitInit, GitLog, GitMerge, GitPaletteView, GitPull, GitPush, GitRemove, GitRun, GitShow, GitStageFiles, GitStageHunk, GitStashApply, GitStashDrop, GitStashPop, GitStashSave, GitStatus, GitTags, GitUnstageFiles, git;

  CompositeDisposable = require('atom').CompositeDisposable;

  git = require('./git');

  GitPaletteView = require('./views/git-palette-view');

  GitAdd = require('./models/git-add');

  GitAddAllAndCommit = require('./models/git-add-all-and-commit');

  GitAddAllCommitAndPush = require('./models/git-add-all-commit-and-push');

  GitAddAndCommit = require('./models/git-add-and-commit');

  GitBranch = require('./models/git-branch');

  GitDeleteLocalBranch = require('./models/git-delete-local-branch.coffee');

  GitDeleteRemoteBranch = require('./models/git-delete-remote-branch.coffee');

  GitCheckoutAllFiles = require('./models/git-checkout-all-files');

  GitCheckoutCurrentFile = require('./models/git-checkout-current-file');

  GitCherryPick = require('./models/git-cherry-pick');

  GitCommit = require('./models/git-commit');

  GitCommitAmend = require('./models/git-commit-amend');

  GitDiff = require('./models/git-diff');

  GitDiffAll = require('./models/git-diff-all');

  GitFetch = require('./models/git-fetch');

  GitFetchPrune = require('./models/git-fetch-prune.coffee');

  GitInit = require('./models/git-init');

  GitLog = require('./models/git-log');

  GitPull = require('./models/git-pull');

  GitPush = require('./models/git-push');

  GitRemove = require('./models/git-remove');

  GitShow = require('./models/git-show');

  GitStageFiles = require('./models/git-stage-files');

  GitStageHunk = require('./models/git-stage-hunk');

  GitStashApply = require('./models/git-stash-apply');

  GitStashDrop = require('./models/git-stash-drop');

  GitStashPop = require('./models/git-stash-pop');

  GitStashSave = require('./models/git-stash-save');

  GitStatus = require('./models/git-status');

  GitTags = require('./models/git-tags');

  GitUnstageFiles = require('./models/git-unstage-files');

  GitRun = require('./models/git-run');

  GitMerge = require('./models/git-merge');

  module.exports = {
    config: {
      includeStagedDiff: {
        title: 'Include staged diffs?',
        description: 'description',
        type: 'boolean',
        "default": true
      },
      openInPane: {
        type: 'boolean',
        "default": true,
        description: 'Allow commands to open new panes'
      },
      splitPane: {
        title: 'Split pane direction (up, right, down, or left)',
        type: 'string',
        "default": 'right',
        description: 'Where should new panes go? (Defaults to right)'
      },
      wordDiff: {
        type: 'boolean',
        "default": true,
        description: 'Should word diffs be highlighted in diffs?'
      },
      amountOfCommitsToShow: {
        type: 'integer',
        "default": 25,
        minimum: 1
      },
      gitPath: {
        type: 'string',
        "default": 'git',
        description: 'Where is your git?'
      },
      messageTimeout: {
        type: 'integer',
        "default": 5,
        description: 'How long should success/error messages be shown?'
      }
    },
    subscriptions: new CompositeDisposable,
    activate: function(state) {
      var repos;
      repos = atom.project.getRepositories().filter(function(r) {
        return r != null;
      });
      if (repos.length === 0) {
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:init', function() {
          return GitInit();
        }));
      }
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:menu', function() {
        return new GitPaletteView();
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:add', function() {
        return git.getRepo().then(function(repo) {
          return GitAdd(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:add-all', function() {
        return git.getRepo().then(function(repo) {
          return GitAdd(repo, {
            addAll: true
          });
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:commit', function() {
        return git.getRepo().then(function(repo) {
          return new GitCommit(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:commit-all', function() {
        return git.getRepo().then(function(repo) {
          return new GitCommit(repo, {
            stageChanges: true
          });
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:commit-amend', function() {
        return git.getRepo().then(function(repo) {
          return new GitCommitAmend(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:add-and-commit', function() {
        return git.getRepo().then(function(repo) {
          return GitAddAndCommit(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:add-all-and-commit', function() {
        return git.getRepo().then(function(repo) {
          return GitAddAllAndCommit(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:add-all-commit-and-push', function() {
        return git.getRepo().then(function(repo) {
          return GitAddAllCommitAndPush(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:checkout', function() {
        return git.getRepo().then(function(repo) {
          return GitBranch.gitBranches(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:checkout-remote', function() {
        return git.getRepo().then(function(repo) {
          return GitBranch.gitRemoteBranches(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:checkout-current-file', function() {
        return git.getRepo().then(function(repo) {
          return GitCheckoutCurrentFile(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:checkout-all-files', function() {
        return git.getRepo().then(function(repo) {
          return GitCheckoutAllFiles(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:new-branch', function() {
        return git.getRepo().then(function(repo) {
          return GitBranch.newBranch(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:delete-local-branch', function() {
        return git.getRepo().then(function(repo) {
          return GitDeleteLocalBranch(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:delete-remote-branch', function() {
        return git.getRepo().then(function(repo) {
          return GitDeleteRemoteBranch(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:cherry-pick', function() {
        return git.getRepo().then(function(repo) {
          return GitCherryPick(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:diff', function() {
        return git.getRepo().then(function(repo) {
          return GitDiff(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:diff-all', function() {
        return git.getRepo().then(function(repo) {
          return GitDiffAll(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:fetch', function() {
        return git.getRepo().then(function(repo) {
          return GitFetch(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:fetch-prune', function() {
        return git.getRepo().then(function(repo) {
          return GitFetchPrune(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:pull', function() {
        return git.getRepo().then(function(repo) {
          return GitPull(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:pull-using-rebase', function() {
        return git.getRepo().then(function(repo) {
          return GitPull(repo, {
            rebase: true
          });
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:push', function() {
        return git.getRepo().then(function(repo) {
          return GitPush(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:remove', function() {
        return git.getRepo().then(function(repo) {
          return GitRemove(repo, {
            showSelector: true
          });
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:remove-current-file', function() {
        return git.getRepo().then(function(repo) {
          return GitRemove(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:reset', function() {
        return git.getRepo().then(function(repo) {
          return git.reset(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:show', function() {
        return git.getRepo().then(function(repo) {
          return GitShow(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:log', function() {
        return git.getRepo().then(function(repo) {
          return GitLog(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:log-current-file', function() {
        return git.getRepo().then(function(repo) {
          return GitLog(repo, {
            onlyCurrentFile: true
          });
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stage-files', function() {
        return git.getRepo().then(function(repo) {
          return GitStageFiles(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:unstage-files', function() {
        return git.getRepo().then(function(repo) {
          return GitUnstageFiles(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stage-hunk', function() {
        return git.getRepo().then(function(repo) {
          return GitStageHunk(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stash-save-changes', function() {
        return git.getRepo().then(function(repo) {
          return GitStashSave(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stash-pop', function() {
        return git.getRepo().then(function(repo) {
          return GitStashPop(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stash-apply', function() {
        return git.getRepo().then(function(repo) {
          return GitStashApply(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stash-delete', function() {
        return git.getRepo().then(function(repo) {
          return GitStashDrop(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:status', function() {
        return git.getRepo().then(function(repo) {
          return GitStatus(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:tags', function() {
        return git.getRepo().then(function(repo) {
          return GitTags(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:run', function() {
        return git.getRepo().then(function(repo) {
          return new GitRun(repo);
        });
      }));
      return this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:merge', function() {
        return git.getRepo().then(function(repo) {
          return GitMerge(repo);
        });
      }));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    }
  };

}).call(this);
