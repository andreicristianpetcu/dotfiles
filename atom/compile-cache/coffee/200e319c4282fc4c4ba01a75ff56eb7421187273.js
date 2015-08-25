(function() {
  var SymbolGen;

  SymbolGen = require('../lib/symbol-gen');

  describe("SymbolGen", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('symbolGen');
    });
    return describe("when the symbol-gen:toggle event is triggered", function() {
      return it("attaches and then detaches the view", function() {
        expect(workspaceElement.querySelector('.symbol-gen')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'symbol-gen:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          expect(workspaceElement.querySelector('.symbol-gen')).toExist();
          atom.views.getView(atom.workspace).trigger('symbol-gen:toggle');
          return expect(workspaceElement.querySelector('.symbol-gen')).not.toExist();
        });
      });
    });
  });

}).call(this);
