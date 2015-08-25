(function() {
  var BlameViewController, GitBlame, configProject, fs, path, temp;

  path = require('path');

  temp = require('temp');

  fs = require('fs-plus');

  GitBlame = require('../lib/git-blame');

  BlameViewController = require('../lib/controllers/blameViewController');

  configProject = function(projectPath) {
    var tempPath;
    tempPath = temp.mkdirSync(path.basename(projectPath));
    fs.copySync(projectPath, tempPath);
    if (fs.existsSync(path.join(tempPath, 'git.git'))) {
      fs.renameSync(path.join(tempPath, 'git.git'), path.join(tempPath, '.git'));
    }
    return tempPath;
  };

  describe("git-blame", function() {
    beforeEach(function() {
      atom.packages.activatePackage('git-blame');
      return spyOn(BlameViewController, 'toggleBlame');
    });
    describe("when a single git root folder is loaded", function() {
      return it('should toggle blame with the associated git repo', function() {
        var projectPath, tempPath;
        projectPath = path.join(__dirname, 'fixtures', 'repo1');
        tempPath = configProject(projectPath);
        atom.project.setPaths([tempPath]);
        waitsForPromise(function() {
          return atom.project.open(path.join(tempPath, 'a.txt')).then(function(o) {
            var pane;
            pane = atom.workspace.getActivePane();
            return pane.activateItem(o);
          });
        });
        return runs(function() {
          var workspaceElement;
          workspaceElement = atom.views.getView(atom.workspace);
          waitsForPromise(function() {
            return GitBlame.toggleBlame();
          });
          return runs(function() {
            var blamer, expectedGitPath;
            expect(BlameViewController.toggleBlame).toHaveBeenCalled();
            blamer = BlameViewController.toggleBlame.calls[0].args[0];
            expectedGitPath = fs.realpathSync(path.join(tempPath, '.git'));
            return expect(blamer.repo.path).toEqual(expectedGitPath);
          });
        });
      });
    });
    describe("when multiple git root folders are loaded", function() {
      return it('should toggle blame with the associated git repo', function() {
        var projectPath1, projectPath2, tempPath1, tempPath2;
        projectPath1 = path.join(__dirname, 'fixtures', 'repo1');
        tempPath1 = configProject(projectPath1);
        projectPath2 = path.join(__dirname, 'fixtures', 'repo2');
        tempPath2 = configProject(projectPath2);
        atom.project.setPaths([tempPath2, tempPath1]);
        waitsForPromise(function() {
          return atom.project.open(path.join(tempPath1, 'a.txt')).then(function(o) {
            var pane;
            pane = atom.workspace.getActivePane();
            return pane.activateItem(o);
          });
        });
        return runs(function() {
          var workspaceElement;
          workspaceElement = atom.views.getView(atom.workspace);
          waitsForPromise(function() {
            return GitBlame.toggleBlame();
          });
          return runs(function() {
            var blamer, expectedGitPath;
            expect(BlameViewController.toggleBlame).toHaveBeenCalled();
            blamer = BlameViewController.toggleBlame.calls[0].args[0];
            expectedGitPath = fs.realpathSync(path.join(tempPath1, '.git'));
            return expect(blamer.repo.path).toEqual(expectedGitPath);
          });
        });
      });
    });
    return describe("when zero git root folders are active", function() {
      return it('should not toggle blame', function() {
        var projectPath, tempPath;
        projectPath = path.join(__dirname, 'fixtures', 'non-git');
        tempPath = configProject(projectPath);
        atom.project.setPaths([tempPath]);
        waitsForPromise(function() {
          return atom.project.open(path.join(tempPath, 'test.txt')).then(function(o) {
            var pane;
            pane = atom.workspace.getActivePane();
            return pane.activateItem(o);
          });
        });
        return runs(function() {
          var workspaceElement;
          workspaceElement = atom.views.getView(atom.workspace);
          waitsForPromise(function() {
            return GitBlame.toggleBlame();
          });
          return runs(function() {
            return expect(BlameViewController.toggleBlame).not.toHaveBeenCalled();
          });
        });
      });
    });
  });

}).call(this);
