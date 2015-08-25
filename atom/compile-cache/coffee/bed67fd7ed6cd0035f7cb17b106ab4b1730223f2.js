(function() {
  var LogListView, ViewUriLog, amountOfCommitsToShow, git, gitLog;

  git = require('../git');

  LogListView = require('../views/log-list-view');

  ViewUriLog = 'atom://git-plus:log';

  amountOfCommitsToShow = function() {
    return atom.config.get('git-plus.amountOfCommitsToShow');
  };

  gitLog = function(repo, _arg) {
    var currentFile, onlyCurrentFile, _ref;
    onlyCurrentFile = (_arg != null ? _arg : {}).onlyCurrentFile;
    currentFile = repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    atom.workspace.addOpener(function(filePath) {
      if (filePath === ViewUriLog) {
        return new LogListView;
      }
    });
    return atom.workspace.open(ViewUriLog).done(function(view) {
      if (view instanceof LogListView) {
        view.setRepo(repo);
        if (onlyCurrentFile) {
          return view.currentFileLog(onlyCurrentFile, currentFile);
        } else {
          return view.branchLog();
        }
      }
    });
  };

  module.exports = gitLog;

}).call(this);
