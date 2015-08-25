(function() {
  var EventEmitter, ProcessManager, Stream, childprocess, makeFakeProcess;

  childprocess = require('child_process');

  EventEmitter = require('events').EventEmitter;

  ProcessManager = require('../../lib/debugger').ProcessManager;

  Stream = require('stream');

  makeFakeProcess = function() {
    var process;
    process = new EventEmitter();
    process.stdout = new Stream();
    process.stderr = new Stream();
    return process;
  };

  describe('ProcessManager', function() {
    return describe('.start', function() {
      return it('starts a process base on the atom config and if no file specify', function() {
        var atomStub, manager, mapping;
        mapping = {
          'node-debugger.nodePath': '/path/to/node',
          'node-debugger.appArgs': '--name',
          'node-debugger.debugPort': 5860
        };
        atomStub = {
          workspace: {
            getActiveTextEditor: function() {
              return {
                getPath: function() {
                  return '/path/to/file.js';
                }
              };
            }
          },
          config: {
            get: function(key) {
              return mapping[key];
            }
          }
        };
        spyOn(childprocess, 'spawn').andReturn(makeFakeProcess());
        manager = new ProcessManager(atomStub);
        return waitsForPromise(function() {
          return manager.start().then(function() {
            expect(childprocess.spawn).toHaveBeenCalled();
            expect(childprocess.spawn.mostRecentCall.args[0]).toEqual('/path/to/node');
            expect(childprocess.spawn.mostRecentCall.args[1][0]).toEqual('--debug-brk=5860');
            expect(childprocess.spawn.mostRecentCall.args[1][1]).toEqual('/path/to/file.js');
            return expect(childprocess.spawn.mostRecentCall.args[1][2]).toEqual('--name');
          });
        });
      });
    });
  });

}).call(this);
