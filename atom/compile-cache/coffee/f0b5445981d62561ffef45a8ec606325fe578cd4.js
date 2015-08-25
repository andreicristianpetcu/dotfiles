(function() {
  var OpenGitModifiedFiles;

  OpenGitModifiedFiles = require('../lib/open-git-modified-files');

  describe("OpenGitModifiedFiles", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('open-git-modified-files');
    });
    return describe("when the open-git-modified-files:toggle event is triggered", function() {
      it("hides and shows the modal panel", function() {
        expect(workspaceElement.querySelector('.open-git-modified-files')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'open-git-modified-files:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var openGitModifiedFilesElement, openGitModifiedFilesPanel;
          expect(workspaceElement.querySelector('.open-git-modified-files')).toExist();
          openGitModifiedFilesElement = workspaceElement.querySelector('.open-git-modified-files');
          expect(openGitModifiedFilesElement).toExist();
          openGitModifiedFilesPanel = atom.workspace.panelForItem(openGitModifiedFilesElement);
          expect(openGitModifiedFilesPanel.isVisible()).toBe(true);
          atom.commands.dispatch(workspaceElement, 'open-git-modified-files:toggle');
          return expect(openGitModifiedFilesPanel.isVisible()).toBe(false);
        });
      });
      return it("hides and shows the view", function() {
        jasmine.attachToDOM(workspaceElement);
        expect(workspaceElement.querySelector('.open-git-modified-files')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'open-git-modified-files:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var openGitModifiedFilesElement;
          openGitModifiedFilesElement = workspaceElement.querySelector('.open-git-modified-files');
          expect(openGitModifiedFilesElement).toBeVisible();
          atom.commands.dispatch(workspaceElement, 'open-git-modified-files:toggle');
          return expect(openGitModifiedFilesElement).not.toBeVisible();
        });
      });
    });
  });

}).call(this);
