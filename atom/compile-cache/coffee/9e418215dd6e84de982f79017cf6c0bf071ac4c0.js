(function() {
  var getCommands, git;

  git = require('./git');

  getCommands = function() {
    var GitAdd, GitAddAllAndCommit, GitAddAllCommitAndPush, GitAddAndCommit, GitBranch, GitCheckoutAllFiles, GitCheckoutCurrentFile, GitCherryPick, GitCommit, GitCommitAmend, GitDeleteLocalBranch, GitDeleteRemoteBranch, GitDiff, GitDiffAll, GitFetch, GitFetchPrune, GitInit, GitLog, GitMerge, GitPull, GitPush, GitRemove, GitRun, GitShow, GitStageFiles, GitStageHunk, GitStashApply, GitStashDrop, GitStashPop, GitStashSave, GitStatus, GitTags, GitUnstageFiles;
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
    return git.getRepo().then(function(repo) {
      var commands;
      git.refresh();
      commands = [];
      commands.push([
        'git-plus:add', 'Add', function() {
          return GitAdd(repo);
        }
      ]);
      commands.push([
        'git-plus:add-all', 'Add All', function() {
          return GitAdd(repo, {
            addAll: true
          });
        }
      ]);
      commands.push([
        'git-plus:log', 'Log', function() {
          return GitLog(repo);
        }
      ]);
      commands.push([
        'git-plus:log-current-file', 'Log Current File', function() {
          return GitLog(repo, {
            onlyCurrentFile: true
          });
        }
      ]);
      commands.push([
        'git-plus:remove-current-file', 'Remove Current File', function() {
          return GitRemove(repo);
        }
      ]);
      commands.push([
        'git-plus:checkout-all-files', 'Checkout All Files', function() {
          return GitCheckoutAllFiles(repo);
        }
      ]);
      commands.push([
        'git-plus:checkout-current-file', 'Checkout Current File', function() {
          return GitCheckoutCurrentFile(repo);
        }
      ]);
      commands.push([
        'git-plus:commit', 'Commit', function() {
          return new GitCommit(repo);
        }
      ]);
      commands.push([
        'git-plus:commit-all', 'Commit All', function() {
          return new GitCommit(repo, {
            stageChanges: true
          });
        }
      ]);
      commands.push([
        'git-plus:commit-amend', 'Commit Amend', function() {
          return GitCommitAmend(repo);
        }
      ]);
      commands.push([
        'git-plus:add-and-commit', 'Add And Commit', function() {
          return GitAddAndCommit(repo);
        }
      ]);
      commands.push([
        'git-plus:add-all-and-commit', 'Add All And Commit', function() {
          return GitAddAllAndCommit(repo);
        }
      ]);
      commands.push([
        'git-plus:add-all-commit-and-push', 'Add All Commit And Push', function() {
          return GitAddAllCommitAndPush(repo);
        }
      ]);
      commands.push([
        'git-plus:checkout', 'Checkout', function() {
          return GitBranch.gitBranches(repo);
        }
      ]);
      commands.push([
        'git-plus:checkout-remote', 'Checkout Remote', function() {
          return GitBranch.gitRemoteBranches(repo);
        }
      ]);
      commands.push([
        'git-plus:new-branch', 'Checkout New Branch', function() {
          return GitBranch.newBranch(repo);
        }
      ]);
      commands.push([
        'git-plus:delete-local-branch', 'Delete Local Branch', function() {
          return GitDeleteLocalBranch(repo);
        }
      ]);
      commands.push([
        'git-plus:delete-remote-branch', 'Delete Remote Branch', function() {
          return GitDeleteRemoteBranch(repo);
        }
      ]);
      commands.push([
        'git-plus:cherry-pick', 'Cherry-Pick', function() {
          return GitCherryPick(repo);
        }
      ]);
      commands.push([
        'git-plus:diff', 'Diff', function() {
          return GitDiff(repo);
        }
      ]);
      commands.push([
        'git-plus:diff-all', 'Diff All', function() {
          return GitDiffAll(repo);
        }
      ]);
      commands.push([
        'git-plus:fetch', 'Fetch', function() {
          return GitFetch(repo);
        }
      ]);
      commands.push([
        'git-plus:fetch-prune', 'Fetch Prune', function() {
          return GitFetchPrune(repo);
        }
      ]);
      commands.push([
        'git-plus:pull', 'Pull', function() {
          return GitPull(repo);
        }
      ]);
      commands.push([
        'git-plus:pull-using-rebase', 'Pull Using Rebase', function() {
          return GitPull(repo, {
            rebase: true
          });
        }
      ]);
      commands.push([
        'git-plus:push', 'Push', function() {
          return GitPush(repo);
        }
      ]);
      commands.push([
        'git-plus:remove', 'Remove', function() {
          return GitRemove(repo, {
            showSelector: true
          });
        }
      ]);
      commands.push([
        'git-plus:reset', 'Reset HEAD', function() {
          return git.reset(repo);
        }
      ]);
      commands.push([
        'git-plus:show', 'Show', function() {
          return GitShow(repo);
        }
      ]);
      commands.push([
        'git-plus:stage-files', 'Stage Files', function() {
          return GitStageFiles(repo);
        }
      ]);
      commands.push([
        'git-plus:unstage-files', 'Unstage Files', function() {
          return GitUnstageFiles(repo);
        }
      ]);
      commands.push([
        'git-plus:stage-hunk', 'Stage Hunk', function() {
          return GitStageHunk(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-save-changes', 'Stash: Save Changes', function() {
          return GitStashSave(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-pop', 'Stash: Apply (Pop)', function() {
          return GitStashPop(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-apply', 'Stash: Apply (Keep)', function() {
          return GitStashApply(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-delete', 'Stash: Delete (Drop)', function() {
          return GitStashDrop(repo);
        }
      ]);
      commands.push([
        'git-plus:status', 'Status', function() {
          return GitStatus(repo);
        }
      ]);
      commands.push([
        'git-plus:tags', 'Tags', function() {
          return GitTags(repo);
        }
      ]);
      commands.push([
        'git-plus:run', 'Run', function() {
          return new GitRun(repo);
        }
      ]);
      commands.push([
        'git-plus:merge', 'Merge', function() {
          return GitMerge(repo);
        }
      ]);
      return commands;
    });
  };

  module.exports = getCommands;

}).call(this);
