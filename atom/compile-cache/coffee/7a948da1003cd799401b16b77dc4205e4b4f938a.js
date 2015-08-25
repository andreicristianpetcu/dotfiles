(function() {
  var MinimapGitDiff, WorkspaceView;

  MinimapGitDiff = require('../lib/minimap-git-diff');

  WorkspaceView = require('atom').WorkspaceView;

  describe("MinimapGitDiff", function() {
    var activationPromise;
    activationPromise = null;
    beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      return activationPromise = atom.packages.activatePackage('minimap-git-diff');
    });
    return describe("when the minimap-git-diff:toggle event is triggered", function() {
      return it("attaches and then detaches the view", function() {
        expect(atom.workspaceView.find('.minimap-git-diff')).not.toExist();
        atom.workspaceView.trigger('minimap-git-diff:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          expect(atom.workspaceView.find('.minimap-git-diff')).toExist();
          atom.workspaceView.trigger('minimap-git-diff:toggle');
          return expect(atom.workspaceView.find('.minimap-git-diff')).not.toExist();
        });
      });
    });
  });

}).call(this);
