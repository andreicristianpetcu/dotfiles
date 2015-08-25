var _ = require('underscore');
var child_process = require('child_process');
var blameFormatter = require('./blameFormatter');

/**
 * @module GitCommander
 *
 * Utility for executing git commands on a repo in a given working directory.
 */
function GitCommander(path) {
  this.workingDirectory = path;
}

// ================
// Instance Methods
// ================

_.extend(GitCommander.prototype, {

  /**
   * Spawns a process to execute a git command in the GitCommander instances
   * working directory.
   *
   * @param {array|string} args - arguments to call `git` with on the command line
   * @param {function} callback - node callback for error and command output
   */
  exec: function exec(args, callback) {
    if (!_.isArray(args) || !_.isFunction(callback)) {
      return;
    }

    var stdout = '';
    var stderr = '';
    var child = child_process.spawn('git', args, { cwd: this.workingDirectory });
    var processError;

    child.stdout.on('data', function (data) {
      stdout += data;
    });

    child.stderr.on('data', function (data) {
      stderr += data;
    });

    child.on('error', function (error) {
      processError = error;
    });

    child.on('close', function (errorCode) {
      if (processError) {
        return callback(processError);
      }

      if (errorCode) {
        var error = new Error(stderr);
        error.code = errorCode;
        return callback(error);
      }

      return callback(null, stdout.trimRight());
    });
  },

  /**
   * Executes git blame on the input file in the instances working directory
   *
   * @param {string} fileName - name of file to blame, relative to the repos
   *   working directory
   * @param {function} callback - callback funtion to call with results or error
   */
  blame: function blame(fileName, callback) {
    var args = ['blame', '--line-porcelain'];

    // ignore white space based on config
    if (atom.config.get('git-blame.ignoreWhiteSpaceDiffs')) {
      args.push('-w');
    }

    args.push(fileName);

    // Execute blame command and parse
    this.exec(args, function (err, blame) {
      if (err) {
        return callback(err, blame);
      }

      return callback(null, blameFormatter.parseBlame(blame));
    });
  }
});

// ================
// Exports
// ================

module.exports = GitCommander;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FuZHJlaS8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL3V0aWwvZ2l0Q29tbWFuZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNoQyxJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDL0MsSUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7Ozs7Ozs7QUFPbkQsU0FBUyxZQUFZLENBQUMsSUFBSSxFQUFFO0FBQzFCLE1BQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7Q0FDOUI7Ozs7OztBQU1ELENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRTs7Ozs7Ozs7O0FBUy9CLE1BQUksRUFBRSxjQUFTLElBQUksRUFBRSxRQUFRLEVBQUU7QUFDN0IsUUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQy9DLGFBQU87S0FDUjs7QUFFRCxRQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDaEIsUUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLFFBQUksS0FBSyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUMsQ0FBQyxDQUFDO0FBQzNFLFFBQUksWUFBWSxDQUFDOztBQUVqQixTQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBUyxJQUFJLEVBQUU7QUFDckMsWUFBTSxJQUFJLElBQUksQ0FBQztLQUNoQixDQUFDLENBQUM7O0FBRUgsU0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQVMsSUFBSSxFQUFFO0FBQ3JDLFlBQU0sSUFBSSxJQUFJLENBQUM7S0FDaEIsQ0FBQyxDQUFDOztBQUVILFNBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQVMsS0FBSyxFQUFFO0FBQ2hDLGtCQUFZLEdBQUcsS0FBSyxDQUFDO0tBQ3RCLENBQUMsQ0FBQzs7QUFFSCxTQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFTLFNBQVMsRUFBRTtBQUNwQyxVQUFJLFlBQVksRUFBRTtBQUNoQixlQUFPLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztPQUMvQjs7QUFFRCxVQUFJLFNBQVMsRUFBRTtBQUNiLFlBQUksS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzlCLGFBQUssQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ3ZCLGVBQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ3hCOztBQUVELGFBQU8sUUFBUSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztLQUMzQyxDQUFDLENBQUM7R0FDSjs7Ozs7Ozs7O0FBU0QsT0FBSyxFQUFFLGVBQVMsUUFBUSxFQUFFLFFBQVEsRUFBRTtBQUNsQyxRQUFJLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRSxrQkFBa0IsQ0FBQyxDQUFDOzs7QUFHekMsUUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsQ0FBQyxFQUFFO0FBQ3RELFVBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDakI7O0FBRUQsUUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzs7O0FBR3BCLFFBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFVBQVMsR0FBRyxFQUFFLEtBQUssRUFBRTtBQUNuQyxVQUFJLEdBQUcsRUFBRTtBQUNQLGVBQU8sUUFBUSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztPQUM3Qjs7QUFFRCxhQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0tBQ3pELENBQUMsQ0FBQztHQUNKO0NBQ0YsQ0FBQyxDQUFDOzs7Ozs7QUFNSCxNQUFNLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQyIsImZpbGUiOiIvaG9tZS9hbmRyZWkvLmF0b20vcGFja2FnZXMvZ2l0LWJsYW1lL2xpYi91dGlsL2dpdENvbW1hbmRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG5jb25zdCBjaGlsZF9wcm9jZXNzID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpO1xuY29uc3QgYmxhbWVGb3JtYXR0ZXIgPSByZXF1aXJlKCcuL2JsYW1lRm9ybWF0dGVyJyk7XG5cbi8qKlxuICogQG1vZHVsZSBHaXRDb21tYW5kZXJcbiAqXG4gKiBVdGlsaXR5IGZvciBleGVjdXRpbmcgZ2l0IGNvbW1hbmRzIG9uIGEgcmVwbyBpbiBhIGdpdmVuIHdvcmtpbmcgZGlyZWN0b3J5LlxuICovXG5mdW5jdGlvbiBHaXRDb21tYW5kZXIocGF0aCkge1xuICB0aGlzLndvcmtpbmdEaXJlY3RvcnkgPSBwYXRoO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09XG4vLyBJbnN0YW5jZSBNZXRob2RzXG4vLyA9PT09PT09PT09PT09PT09XG5cbl8uZXh0ZW5kKEdpdENvbW1hbmRlci5wcm90b3R5cGUsIHtcblxuICAvKipcbiAgICogU3Bhd25zIGEgcHJvY2VzcyB0byBleGVjdXRlIGEgZ2l0IGNvbW1hbmQgaW4gdGhlIEdpdENvbW1hbmRlciBpbnN0YW5jZXNcbiAgICogd29ya2luZyBkaXJlY3RvcnkuXG4gICAqXG4gICAqIEBwYXJhbSB7YXJyYXl8c3RyaW5nfSBhcmdzIC0gYXJndW1lbnRzIHRvIGNhbGwgYGdpdGAgd2l0aCBvbiB0aGUgY29tbWFuZCBsaW5lXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gbm9kZSBjYWxsYmFjayBmb3IgZXJyb3IgYW5kIGNvbW1hbmQgb3V0cHV0XG4gICAqL1xuICBleGVjOiBmdW5jdGlvbihhcmdzLCBjYWxsYmFjaykge1xuICAgIGlmICghXy5pc0FycmF5KGFyZ3MpIHx8ICFfLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHN0ZG91dCA9ICcnO1xuICAgIHZhciBzdGRlcnIgPSAnJztcbiAgICB2YXIgY2hpbGQgPSBjaGlsZF9wcm9jZXNzLnNwYXduKCdnaXQnLCBhcmdzLCB7Y3dkOiB0aGlzLndvcmtpbmdEaXJlY3Rvcnl9KTtcbiAgICB2YXIgcHJvY2Vzc0Vycm9yO1xuXG4gICAgY2hpbGQuc3Rkb3V0Lm9uKCdkYXRhJywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgc3Rkb3V0ICs9IGRhdGE7XG4gICAgfSk7XG5cbiAgICBjaGlsZC5zdGRlcnIub24oJ2RhdGEnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBzdGRlcnIgKz0gZGF0YTtcbiAgICB9KTtcblxuICAgIGNoaWxkLm9uKCdlcnJvcicsIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBwcm9jZXNzRXJyb3IgPSBlcnJvcjtcbiAgICB9KTtcblxuICAgIGNoaWxkLm9uKCdjbG9zZScsIGZ1bmN0aW9uKGVycm9yQ29kZSkge1xuICAgICAgaWYgKHByb2Nlc3NFcnJvcikge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2socHJvY2Vzc0Vycm9yKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVycm9yQ29kZSkge1xuICAgICAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3Ioc3RkZXJyKTtcbiAgICAgICAgZXJyb3IuY29kZSA9IGVycm9yQ29kZTtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycm9yKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHN0ZG91dC50cmltUmlnaHQoKSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEV4ZWN1dGVzIGdpdCBibGFtZSBvbiB0aGUgaW5wdXQgZmlsZSBpbiB0aGUgaW5zdGFuY2VzIHdvcmtpbmcgZGlyZWN0b3J5XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlTmFtZSAtIG5hbWUgb2YgZmlsZSB0byBibGFtZSwgcmVsYXRpdmUgdG8gdGhlIHJlcG9zXG4gICAqICAgd29ya2luZyBkaXJlY3RvcnlcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBjYWxsYmFjayBmdW50aW9uIHRvIGNhbGwgd2l0aCByZXN1bHRzIG9yIGVycm9yXG4gICAqL1xuICBibGFtZTogZnVuY3Rpb24oZmlsZU5hbWUsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGFyZ3MgPSBbJ2JsYW1lJywgJy0tbGluZS1wb3JjZWxhaW4nXTtcblxuICAgIC8vIGlnbm9yZSB3aGl0ZSBzcGFjZSBiYXNlZCBvbiBjb25maWdcbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdnaXQtYmxhbWUuaWdub3JlV2hpdGVTcGFjZURpZmZzJykpIHtcbiAgICAgIGFyZ3MucHVzaCgnLXcnKTtcbiAgICB9XG5cbiAgICBhcmdzLnB1c2goZmlsZU5hbWUpO1xuXG4gICAgLy8gRXhlY3V0ZSBibGFtZSBjb21tYW5kIGFuZCBwYXJzZVxuICAgIHRoaXMuZXhlYyhhcmdzLCBmdW5jdGlvbihlcnIsIGJsYW1lKSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIGJsYW1lKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIGJsYW1lRm9ybWF0dGVyLnBhcnNlQmxhbWUoYmxhbWUpKTtcbiAgICB9KTtcbiAgfVxufSk7XG5cbi8vID09PT09PT09PT09PT09PT1cbi8vIEV4cG9ydHNcbi8vID09PT09PT09PT09PT09PT1cblxubW9kdWxlLmV4cG9ydHMgPSBHaXRDb21tYW5kZXI7XG4iXX0=