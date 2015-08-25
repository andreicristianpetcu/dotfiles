(function() {
  var BufferedProcess, PlainMessageView, error, exec, fs, getProjectPath, panel, path, simpleExec,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  BufferedProcess = require('atom').BufferedProcess;

  path = require('path');

  fs = require("fs");

  exec = require('child_process').exec;

  PlainMessageView = null;

  panel = null;

  error = function(message, className) {
    var MessagePanelView, _ref;
    if (!panel) {
      _ref = require("atom-message-panel"), MessagePanelView = _ref.MessagePanelView, PlainMessageView = _ref.PlainMessageView;
      panel = new MessagePanelView({
        title: "Atom Ctags"
      });
    }
    panel.attach();
    return panel.add(new PlainMessageView({
      message: message,
      className: className || "text-error",
      raw: true
    }));
  };

  simpleExec = function(command, exit) {
    return exec(command, function(error, stdout, stderr) {
      if (stdout) {
        console.log('stdout: ' + stdout);
      }
      if (stderr) {
        console.log('stderr: ' + stderr);
      }
      if (error) {
        return console.log('exec error: ' + error);
      }
    });
  };

  getProjectPath = function(codepath) {
    var dirPath, directory, _i, _len, _ref;
    _ref = atom.project.getDirectories();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      directory = _ref[_i];
      dirPath = directory.getPath();
      if (dirPath === codepath || directory.contains(codepath)) {
        return dirPath;
      }
    }
  };

  module.exports = function(codepath, isAppend, cmdArgs, callback) {
    var args, childProcess, command, defaultCtagsFile, exit, genPath, projectPath, stderr, t, tags, tagsPath, timeout;
    tags = [];
    command = atom.config.get("atom-ctags.cmd").trim();
    if (command === "") {
      command = path.resolve(__dirname, '..', 'vendor', "ctags-" + process.platform);
    }
    defaultCtagsFile = require.resolve('./.ctags');
    projectPath = getProjectPath(codepath);
    tagsPath = path.join(projectPath, ".tags");
    if (isAppend) {
      genPath = path.join(projectPath, ".tags1");
    } else {
      genPath = tagsPath;
    }
    args = [];
    if (cmdArgs) {
      args.push.apply(args, cmdArgs);
    }
    args.push("--options=" + defaultCtagsFile, '--fields=+KSn', '--excmd=p');
    args.push('-u', '-R', '-f', genPath, codepath);
    stderr = function(data) {
      return console.error("atom-ctags: command error, " + data, genPath);
    };
    exit = function() {
      var _ref;
      clearTimeout(t);
      if (isAppend) {
        if (_ref = process.platform, __indexOf.call('win32', _ref) >= 0) {
          simpleExec("type '" + tagsPath + "' | findstr /V /C:'" + codepath + "' > '" + tagsPath + "2' & ren '" + tagsPath + "2' '" + tagsPath + "' & more +6 '" + genPath + "' >> '" + tagsPath + "'");
        } else {
          simpleExec("grep -v '" + codepath + "' '" + tagsPath + "' > '" + tagsPath + "2'; mv '" + tagsPath + "2' '" + tagsPath + "'; tail -n +7 '" + genPath + "' >> '" + tagsPath + "'");
        }
      }
      return callback(genPath);
    };
    childProcess = new BufferedProcess({
      command: command,
      args: args,
      stderr: stderr,
      exit: exit
    });
    timeout = atom.config.get('atom-ctags.buildTimeout');
    return t = setTimeout(function() {
      childProcess.kill();
      return error("Stopped: Build more than " + (timeout / 1000) + " seconds, check if " + codepath + " contain too many file.<br>\n        Suggest that add CmdArgs at atom-ctags package setting, example:<br>\n            --exclude=some/path --exclude=some/other");
    }, timeout);
  };

}).call(this);
