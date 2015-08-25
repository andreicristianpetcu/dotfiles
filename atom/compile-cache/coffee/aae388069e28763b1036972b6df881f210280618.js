(function() {
  var Path, git, pathToRepoFile, pathToSubmoduleFile;

  git = require('../lib/git');

  Path = require('flavored-path');

  pathToRepoFile = Path.get("~/.atom/packages/git-plus/lib/git.coffee");

  pathToSubmoduleFile = Path.get("~/.atom/packages/git-plus/spec/foo/foo.txt");

  describe("Git-Plus git module", function() {
    describe("git.getRepo", function() {
      return it("returns a promise", function() {
        return waitsForPromise(function() {
          return git.getRepo().then(function(repo) {
            return expect(repo.getWorkingDirectory()).toContain('git-plus');
          });
        });
      });
    });
    describe("git.dir", function() {
      return it("returns a promise", function() {
        return waitsForPromise(function() {
          return git.dir().then(function(dir) {
            return expect(dir).toContain('git-plus');
          });
        });
      });
    });
    return describe("git.getSubmodule", function() {
      it("returns undefined when there is no submodule", function() {
        return expect(git.getSubmodule(pathToRepoFile)).toBe(void 0);
      });
      return it("returns a submodule when given file is in a submodule of a project repo", function() {
        return expect(git.getSubmodule(pathToSubmoduleFile)).toBeTruthy();
      });
    });
  });

}).call(this);
