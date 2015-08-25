var RemoteRevision = require('../lib/util/RemoteRevision');

describe('RemoteRevision', function () {

  var DEFAULT_HASH = '12345';
  var instance;
  var fakeRemoteUrl = 'git@github.com/alexcorre/git-blame.git';

  beforeEach(function () {
    instance = new RemoteRevision(fakeRemoteUrl);
  });

  describe('parseProjectAndRepo', function () {

    beforeEach(function () {
      instance.hash = DEFAULT_HASH;
      instance.remote = null;
    });

    afterEach(function () {
      instance.hash = null;
      instance.remote = fakeRemoteUrl;
    });

    it('Should return an empty object if pattern does not match', function () {
      var weirdRemote = 'NOT_MATCHING';
      instance.remote = weirdRemote;

      var output = instance.parseProjectAndRepo();
      expect(output).toEqual({});
    });

    it('Should parse a standard github url correctly', function () {
      var githubRemote = 'git@github.com:project/someRepo.git';
      instance.remote = githubRemote;

      var output = instance.parseProjectAndRepo();

      expect(output).toEqual({
        project: 'project',
        repo: 'someRepo'
      });
    });

    it('Should parse a standard github url without the .git ending correctly', function () {
      var githubRemote = 'git@github.com:project/someRepo';
      instance.remote = githubRemote;

      var output = instance.parseProjectAndRepo();

      expect(output).toEqual({
        project: 'project',
        repo: 'someRepo'
      });
    });

    it('Should parse a read only github url correctly', function () {
      var githubHttpRemote = 'https://github.com/project/someRepo.git';
      instance.remote = githubHttpRemote;

      var output = instance.parseProjectAndRepo();

      expect(output).toEqual({
        project: 'project',
        repo: 'someRepo'
      });
    });

    it('Should parse a repo url with dashes', function () {
      var githubHttpRemote = 'https://github.com/some-project/some-repo.git';
      instance.remote = githubHttpRemote;

      var output = instance.parseProjectAndRepo();

      expect(output).toEqual({
        project: 'some-project',
        repo: 'some-repo'
      });
    });

    it('Should parse a repo url with dashes and wthout a .git ending correctly', function () {
      var githubHttpRemote = 'https://github.com/some-project/some-repo';
      instance.remote = githubHttpRemote;

      var output = instance.parseProjectAndRepo();

      expect(output).toEqual({
        project: 'some-project',
        repo: 'some-repo'
      });
    });

    it('Should work with a url with a port', function () {
      var portRemoteUrl = 'ssh://git@git.my-company.com:2222/group/repo-name.git';
      instance.remote = portRemoteUrl;

      var output = instance.parseProjectAndRepo();

      expect(output).toEqual({
        project: 'group',
        repo: 'repo-name'
      });
    });

    it('Should work with a url with a port and colon', function () {
      var portRemoteUrl = 'git@git.my-company.com:2222:group/repo-name.git';
      instance.remote = portRemoteUrl;

      var output = instance.parseProjectAndRepo();

      expect(output).toEqual({
        project: 'group',
        repo: 'repo-name'
      });
    });

    it('Should work without a project', function () {
      var repoOnlyUrl = 'git@git.my-company.com:repo-name.git';
      instance.remote = repoOnlyUrl;

      var output = instance.parseProjectAndRepo();

      expect(output).toEqual({
        project: 'repo-name',
        repo: 'repo-name'
      });
    });

    it('Should work when there is a . in the repo name', function () {
      var dotRepoUrl = 'git@github.com:MoOx/moox.github.io.git';
      instance.remote = dotRepoUrl;

      var output = instance.parseProjectAndRepo();

      expect(output).toEqual({
        project: 'MoOx',
        repo: 'moox.github.io'
      });
    });

    it('Should work when there is a . in the project name', function () {
      var dotRepoUrl = 'git@github.com:Mo.Ox/moox.github.io.git';
      instance.remote = dotRepoUrl;

      var output = instance.parseProjectAndRepo();

      expect(output).toEqual({
        project: 'Mo.Ox',
        repo: 'moox.github.io'
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FuZHJlaS8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvc3BlYy9SZW1vdGVSZXZpc2lvbi1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDOztBQUUzRCxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsWUFBVzs7QUFFcEMsTUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDO0FBQzNCLE1BQUksUUFBUSxDQUFDO0FBQ2IsTUFBSSxhQUFhLEdBQUcsd0NBQXdDLENBQUM7O0FBRTdELFlBQVUsQ0FBQyxZQUFZO0FBQ3JCLFlBQVEsR0FBRyxJQUFJLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztHQUM5QyxDQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLHFCQUFxQixFQUFFLFlBQVc7O0FBRXpDLGNBQVUsQ0FBQyxZQUFZO0FBQ3JCLGNBQVEsQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDO0FBQzdCLGNBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0tBQ3hCLENBQUMsQ0FBQzs7QUFFSCxhQUFTLENBQUMsWUFBWTtBQUNwQixjQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNyQixjQUFRLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQztLQUNqQyxDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLHlEQUF5RCxFQUFFLFlBQVk7QUFDeEUsVUFBSSxXQUFXLEdBQUcsY0FBYyxDQUFDO0FBQ2pDLGNBQVEsQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDOztBQUU5QixVQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztBQUM1QyxZQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQzVCLENBQUMsQ0FBQzs7QUFHSCxNQUFFLENBQUMsOENBQThDLEVBQUUsWUFBWTtBQUM3RCxVQUFJLFlBQVksR0FBRyxxQ0FBcUMs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dGVSZXZpc2lvbi1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFJlbW90ZVJldmlzaW9uID0gcmVxdWlyZSgnLi4vbGliL3V0aWwvUmVtb3RlUmV2aXNpb24nKTtcblxuZGVzY3JpYmUoJ1JlbW90ZVJldmlzaW9uJywgZnVuY3Rpb24oKSB7XG5cbiAgdmFyIERFRkFVTFRfSEFTSCA9ICcxMjM0NSc7XG4gIHZhciBpbnN0YW5jZTtcbiAgdmFyIGZha2VSZW1vdGVVcmwgPSAnZ2l0QGdpdGh1Yi5jb20vYWxleGNvcnJlL2dpdC1ibGFtZS5naXQnO1xuXG4gIGJlZm9yZUVhY2goZnVuY3Rpb24gKCkge1xuICAgIGluc3RhbmNlID0gbmV3IFJlbW90ZVJldmlzaW9uKGZha2VSZW1vdGVVcmwpO1xuICB9KTtcblxuICBkZXNjcmliZSgncGFyc2VQcm9qZWN0QW5kUmVwbycsIGZ1bmN0aW9uKCkge1xuXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICBpbnN0YW5jZS5oYXNoID0gREVGQVVMVF9IQVNIO1xuICAgICAgaW5zdGFuY2UucmVtb3RlID0gbnVsbDtcbiAgICB9KTtcblxuICAgIGFmdGVyRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICBpbnN0YW5jZS5oYXNoID0gbnVsbDtcbiAgICAgIGluc3RhbmNlLnJlbW90ZSA9IGZha2VSZW1vdGVVcmw7XG4gICAgfSk7XG5cbiAgICBpdCgnU2hvdWxkIHJldHVybiBhbiBlbXB0eSBvYmplY3QgaWYgcGF0dGVybiBkb2VzIG5vdCBtYXRjaCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB3ZWlyZFJlbW90ZSA9ICdOT1RfTUFUQ0hJTkcnO1xuICAgICAgaW5zdGFuY2UucmVtb3RlID0gd2VpcmRSZW1vdGU7XG5cbiAgICAgIHZhciBvdXRwdXQgPSBpbnN0YW5jZS5wYXJzZVByb2plY3RBbmRSZXBvKCk7XG4gICAgICBleHBlY3Qob3V0cHV0KS50b0VxdWFsKHt9KTtcbiAgICB9KTtcblxuXG4gICAgaXQoJ1Nob3VsZCBwYXJzZSBhIHN0YW5kYXJkIGdpdGh1YiB1cmwgY29ycmVjdGx5JywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGdpdGh1YlJlbW90ZSA9ICdnaXRAZ2l0aHViLmNvbTpwcm9qZWN0L3NvbWVSZXBvLmdpdCc7XG4gICAgICBpbnN0YW5jZS5yZW1vdGUgPSBnaXRodWJSZW1vdGU7XG5cbiAgICAgIHZhciBvdXRwdXQgPSBpbnN0YW5jZS5wYXJzZVByb2plY3RBbmRSZXBvKCk7XG5cbiAgICAgIGV4cGVjdChvdXRwdXQpLnRvRXF1YWwoe1xuICAgICAgICBwcm9qZWN0OiAncHJvamVjdCcsXG4gICAgICAgIHJlcG86ICdzb21lUmVwbydcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ1Nob3VsZCBwYXJzZSBhIHN0YW5kYXJkIGdpdGh1YiB1cmwgd2l0aG91dCB0aGUgLmdpdCBlbmRpbmcgY29ycmVjdGx5JywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGdpdGh1YlJlbW90ZSA9ICdnaXRAZ2l0aHViLmNvbTpwcm9qZWN0L3NvbWVSZXBvJztcbiAgICAgIGluc3RhbmNlLnJlbW90ZSA9IGdpdGh1YlJlbW90ZTtcblxuICAgICAgdmFyIG91dHB1dCA9IGluc3RhbmNlLnBhcnNlUHJvamVjdEFuZFJlcG8oKTtcblxuICAgICAgZXhwZWN0KG91dHB1dCkudG9FcXVhbCh7XG4gICAgICAgIHByb2plY3Q6ICdwcm9qZWN0JyxcbiAgICAgICAgcmVwbzogJ3NvbWVSZXBvJ1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnU2hvdWxkIHBhcnNlIGEgcmVhZCBvbmx5IGdpdGh1YiB1cmwgY29ycmVjdGx5JywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGdpdGh1Ykh0dHBSZW1vdGUgPSAnaHR0cHM6Ly9naXRodWIuY29tL3Byb2plY3Qvc29tZVJlcG8uZ2l0JztcbiAgICAgIGluc3RhbmNlLnJlbW90ZSA9IGdpdGh1Ykh0dHBSZW1vdGU7XG5cbiAgICAgIHZhciBvdXRwdXQgPSBpbnN0YW5jZS5wYXJzZVByb2plY3RBbmRSZXBvKCk7XG5cbiAgICAgIGV4cGVjdChvdXRwdXQpLnRvRXF1YWwoe1xuICAgICAgICBwcm9qZWN0OiAncHJvamVjdCcsXG4gICAgICAgIHJlcG86ICdzb21lUmVwbydcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ1Nob3VsZCBwYXJzZSBhIHJlcG8gdXJsIHdpdGggZGFzaGVzJywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGdpdGh1Ykh0dHBSZW1vdGUgPSAnaHR0cHM6Ly9naXRodWIuY29tL3NvbWUtcHJvamVjdC9zb21lLXJlcG8uZ2l0JztcbiAgICAgIGluc3RhbmNlLnJlbW90ZSA9IGdpdGh1Ykh0dHBSZW1vdGU7XG5cbiAgICAgIHZhciBvdXRwdXQgPSBpbnN0YW5jZS5wYXJzZVByb2plY3RBbmRSZXBvKCk7XG5cbiAgICAgIGV4cGVjdChvdXRwdXQpLnRvRXF1YWwoe1xuICAgICAgICBwcm9qZWN0OiAnc29tZS1wcm9qZWN0JyxcbiAgICAgICAgcmVwbzogJ3NvbWUtcmVwbydcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ1Nob3VsZCBwYXJzZSBhIHJlcG8gdXJsIHdpdGggZGFzaGVzIGFuZCB3dGhvdXQgYSAuZ2l0IGVuZGluZyBjb3JyZWN0bHknLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZ2l0aHViSHR0cFJlbW90ZSA9ICdodHRwczovL2dpdGh1Yi5jb20vc29tZS1wcm9qZWN0L3NvbWUtcmVwbyc7XG4gICAgICBpbnN0YW5jZS5yZW1vdGUgPSBnaXRodWJIdHRwUmVtb3RlO1xuXG4gICAgICB2YXIgb3V0cHV0ID0gaW5zdGFuY2UucGFyc2VQcm9qZWN0QW5kUmVwbygpO1xuXG4gICAgICBleHBlY3Qob3V0cHV0KS50b0VxdWFsKHtcbiAgICAgICAgcHJvamVjdDogJ3NvbWUtcHJvamVjdCcsXG4gICAgICAgIHJlcG86ICdzb21lLXJlcG8nXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdTaG91bGQgd29yayB3aXRoIGEgdXJsIHdpdGggYSBwb3J0JywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcG9ydFJlbW90ZVVybCA9ICdzc2g6Ly9naXRAZ2l0Lm15LWNvbXBhbnkuY29tOjIyMjIvZ3JvdXAvcmVwby1uYW1lLmdpdCc7XG4gICAgICBpbnN0YW5jZS5yZW1vdGUgPSBwb3J0UmVtb3RlVXJsO1xuXG4gICAgICB2YXIgb3V0cHV0ID0gaW5zdGFuY2UucGFyc2VQcm9qZWN0QW5kUmVwbygpO1xuXG4gICAgICBleHBlY3Qob3V0cHV0KS50b0VxdWFsKHtcbiAgICAgICAgcHJvamVjdDogJ2dyb3VwJyxcbiAgICAgICAgcmVwbzogJ3JlcG8tbmFtZSdcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ1Nob3VsZCB3b3JrIHdpdGggYSB1cmwgd2l0aCBhIHBvcnQgYW5kIGNvbG9uJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcG9ydFJlbW90ZVVybCA9ICdnaXRAZ2l0Lm15LWNvbXBhbnkuY29tOjIyMjI6Z3JvdXAvcmVwby1uYW1lLmdpdCc7XG4gICAgICBpbnN0YW5jZS5yZW1vdGUgPSBwb3J0UmVtb3RlVXJsO1xuXG4gICAgICB2YXIgb3V0cHV0ID0gaW5zdGFuY2UucGFyc2VQcm9qZWN0QW5kUmVwbygpO1xuXG4gICAgICBleHBlY3Qob3V0cHV0KS50b0VxdWFsKHtcbiAgICAgICAgcHJvamVjdDogJ2dyb3VwJyxcbiAgICAgICAgcmVwbzogJ3JlcG8tbmFtZSdcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ1Nob3VsZCB3b3JrIHdpdGhvdXQgYSBwcm9qZWN0JywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVwb09ubHlVcmwgPSAnZ2l0QGdpdC5teS1jb21wYW55LmNvbTpyZXBvLW5hbWUuZ2l0JztcbiAgICAgIGluc3RhbmNlLnJlbW90ZSA9IHJlcG9Pbmx5VXJsO1xuXG4gICAgICB2YXIgb3V0cHV0ID0gaW5zdGFuY2UucGFyc2VQcm9qZWN0QW5kUmVwbygpO1xuXG4gICAgICBleHBlY3Qob3V0cHV0KS50b0VxdWFsKHtcbiAgICAgICAgcHJvamVjdDogJ3JlcG8tbmFtZScsXG4gICAgICAgIHJlcG86ICdyZXBvLW5hbWUnXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdTaG91bGQgd29yayB3aGVuIHRoZXJlIGlzIGEgLiBpbiB0aGUgcmVwbyBuYW1lJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZG90UmVwb1VybCA9ICdnaXRAZ2l0aHViLmNvbTpNb094L21vb3guZ2l0aHViLmlvLmdpdCc7XG4gICAgICBpbnN0YW5jZS5yZW1vdGUgPSBkb3RSZXBvVXJsO1xuXG4gICAgICB2YXIgb3V0cHV0ID0gaW5zdGFuY2UucGFyc2VQcm9qZWN0QW5kUmVwbygpO1xuXG4gICAgICBleHBlY3Qob3V0cHV0KS50b0VxdWFsKHtcbiAgICAgICAgcHJvamVjdDogJ01vT3gnLFxuICAgICAgICByZXBvOiAnbW9veC5naXRodWIuaW8nXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdTaG91bGQgd29yayB3aGVuIHRoZXJlIGlzIGEgLiBpbiB0aGUgcHJvamVjdCBuYW1lJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZG90UmVwb1VybCA9ICdnaXRAZ2l0aHViLmNvbTpNby5PeC9tb294LmdpdGh1Yi5pby5naXQnO1xuICAgICAgaW5zdGFuY2UucmVtb3RlID0gZG90UmVwb1VybDtcblxuICAgICAgdmFyIG91dHB1dCA9IGluc3RhbmNlLnBhcnNlUHJvamVjdEFuZFJlcG8oKTtcblxuICAgICAgZXhwZWN0KG91dHB1dCkudG9FcXVhbCh7XG4gICAgICAgIHByb2plY3Q6ICdNby5PeCcsXG4gICAgICAgIHJlcG86ICdtb294LmdpdGh1Yi5pbydcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gIH0pO1xuXG59KTtcbiJdfQ==