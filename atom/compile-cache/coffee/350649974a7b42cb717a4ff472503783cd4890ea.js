(function() {
  var AtomTernjs, WorkspaceView;

  WorkspaceView = require('atom').WorkspaceView;

  AtomTernjs = require('../lib/atom-ternjs');

  describe("AtomTernjs", function() {
    var activationPromise;
    activationPromise = null;
    return beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      return activationPromise = atom.packages.activatePackage('atom-ternjs');
    });
  });

}).call(this);
