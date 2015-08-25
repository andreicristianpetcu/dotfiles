(function() {
  var dirname, extname, filename, firstDirname, secondDirname, sep, _ref;

  _ref = require('path'), dirname = _ref.dirname, filename = _ref.filename, extname = _ref.extname, sep = _ref.sep;

  firstDirname = function(filepath) {
    return filepath.split(sep)[0];
  };

  secondDirname = function(filepath) {
    return filepath.split(sep)[1];
  };

  module.exports = function(grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      esteWatch: {
        options: {
          dirs: ['keymaps/**/*', 'lib/**/*', 'menus/**/*', 'spec/**/*', 'styles/**/*', 'node_modules/atom-refactor/**/*', 'vender/coffeescript/lib/**/*'],
          livereload: {
            enabled: false
          }
        },
        '*': function() {
          return ['apm:test'];
        }
      }
    });
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-este-watch');
    grunt.registerTask('apm:test', function() {
      var done;
      done = this.async();
      return grunt.util.spawn({
        cmd: 'apm',
        args: ['test']
      }, function(err, result, code) {
        if (err != null) {
          grunt.util.error(err);
        }
        if (result != null) {
          grunt.log.writeln(result);
        }
        return done();
      });
    });
    grunt.registerTask('cake:generate', function() {
      var done;
      done = this.async();
      return grunt.util.spawn({
        cmd: 'cake',
        args: ['generate']
      }, function(err, result, code) {
        if (err != null) {
          grunt.util.error(err);
        }
        if (result != null) {
          grunt.log.writeln(result);
        }
        return done();
      });
    });
    return grunt.registerTask('default', ['apm:test', 'esteWatch']);
  };

}).call(this);
