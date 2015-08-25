(function() {
  var Server;

  module.exports = Server = (function() {
    Server.prototype.process = null;

    Server.prototype.rootPath = null;

    function Server(rootPath) {
      this.rootPath = rootPath;
    }

    Server.prototype.start = function(callback) {
      var BufferedNodeProcess, BufferedProcess, args, command, options, path, stdout;
      path = require('path');
      command = path.resolve(__dirname, '../node_modules/.bin/tern');
      args = ['--persistent', '--no-port-file', '--verbose'];
      options = {
        cwd: this.rootPath
      };
      stdout = function(output) {
        var port;
        output = output.split(' ');
        port = parseInt(output[output.length - 1]);
        if (isNaN(port) || port === 0) {
          return;
        }
        return callback(port);
      };
      if (this.isPlatformWindows()) {
        BufferedProcess = require('atom').BufferedProcess;
        return this.process = new BufferedProcess({
          command: command,
          args: args,
          options: options,
          stdout: stdout,
          stderr: this.stderr,
          exit: this.exit
        });
      } else {
        BufferedNodeProcess = require('atom').BufferedNodeProcess;
        return this.process = new BufferedNodeProcess({
          command: command,
          args: args,
          options: options,
          stdout: stdout,
          stderr: this.stderr,
          exit: this.exit
        });
      }
    };

    Server.prototype.stop = function() {
      var _ref;
      if ((_ref = this.process) != null) {
        _ref.kill();
      }
      return this.process = null;
    };

    Server.prototype.stderr = function(output) {
      var content;
      content = "atom-ternjs<br />" + output;
      return atom.notifications.addError(content, {
        dismissable: true
      });
    };

    Server.prototype.exit = function(code) {
      var content;
      content = "tern exited with code: " + code + ".<br />Restart the server via Packages -> Atom Ternjs -> Restart server";
      return atom.notifications.addError(content, {
        dismissable: true
      });
    };

    Server.prototype.isPlatformWindows = function() {
      return document.getElementsByTagName('body')[0].classList.toString().indexOf('platform-win') > -1;
    };

    return Server;

  })();

}).call(this);
