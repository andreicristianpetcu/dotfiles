var _ = require('underscore');
var GitCommander = require('./gitCommander');

/**
 * @module Blamer
 *
 * Blamer is a Class that should be instantiated with an atom 'Git' object
 * for the root repository in the project.
 *
 * @param {Git} repo - an instance of 'Git' class from atom workspace. See
 *   https://atom.io/docs/api/v0.92.0/api/ for more info.
 */
var Blamer = function Blamer(repo) {
  if (!repo) {
    throw new Error('Cannot create a Blamer without a repository.');
  }

  this.repo = repo;
  this.initialize();
};

// ================
// Instance Methods
// ================

_.extend(Blamer.prototype, {

  /**
   * Initializes this Blamer instance, by creating git-tools repos for the root
   * repository and submodules.
   */
  initialize: function initialize() {
    this.tools = {};
    this.tools.root = new GitCommander(this.repo.getWorkingDirectory());

    var submodules = this.repo.submodules;
    if (submodules) {
      for (var submodulePath in submodules) {
        this.tools[submodulePath] = new GitCommander(this.repo.getWorkingDirectory() + '/' + submodulePath);
      }
    }
  },

  /**
   * Blames the given filePath and calls callback with blame lines or error.
   *
   * @param {string} filePath - filePath to blame
   * @param {function} callback - callback to call back with blame data
   */
  blame: function blame(filePath, callback) {
    // Ensure file path is relative to root repo
    filePath = this.repo.relativize(filePath);
    var repoUtil = this.repoUtilForPath(filePath);

    // Ensure that if this file is in a submodule, we remove the submodule dir
    // from the path
    filePath = this.removeSubmodulePrefix(filePath);

    if (!_.isFunction(callback)) {
      throw new Error('Must be called with a callback function');
    }

    // Make the async blame call on the git repo
    repoUtil.blame(filePath, function (err, blame) {
      callback(err, blame);
    });
  },

  /**
   * Utility to get the GitCommander repository for the given filePath. Takes into
   * account whether the file is part of a submodule and returns that repository
   * if necessary.
   *
   * @param {string} filePath - the path to the file in question.
   */
  repoUtilForPath: function repoUtilForPath(filePath) {
    var submodules = this.repo.submodules;

    // By default, we return the root GitCommander repository.
    var repoUtil = this.tools.root;

    // if we have submodules, loop through them and see if the given file path
    // belongs inside one of the repositories. If so, we return the GitCommander repo
    // for that submodule.
    if (submodules) {
      for (var submodulePath in submodules) {
        var submoduleRegex = new RegExp('^' + submodulePath);
        if (submoduleRegex.test(filePath)) {
          repoUtil = this.tools[submodulePath];
        }
      }
    }

    return repoUtil;
  },

  /**
   * If the file path given is inside a submodule, removes the submodule
   * directory prefix.
   *
   * @param {string} filePath - path to file to relativize
   * @param {Repo} toolsRepo - git-tools Repo
   */
  removeSubmodulePrefix: function removeSubmodulePrefix(filePath) {
    var submodules = this.repo.submodules;
    if (submodules) {
      for (var submodulePath in submodules) {
        var submoduleRegex = new RegExp('^' + submodulePath);
        if (submoduleRegex.test(filePath)) {
          filePath = filePath.replace(submoduleRegex, '');
        }
      }
    }

    // remove leading '/' if there is one before returning
    filePath = filePath.replace(/^\//, '');
    return filePath;
  }

});

// ================
// Exports
// ================

module.exports = Blamer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FuZHJlaS8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL3V0aWwvYmxhbWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNoQyxJQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7QUFXL0MsSUFBSSxNQUFNLEdBQUcsU0FBVCxNQUFNLENBQVksSUFBSSxFQUFFO0FBQzFCLE1BQUksQ0FBQyxJQUFJLEVBQUU7QUFDVCxVQUFNLElBQUksS0FBSyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7R0FDakU7O0FBRUQsTUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsTUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0NBQ25CLENBQUM7Ozs7OztBQU1GLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTs7Ozs7O0FBTXpCLFlBQVUsRUFBRSxzQkFBVztBQUNyQixRQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNoQixRQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQzs7QUFFcEUsUUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDdEMsUUFBSSxVQUFVLEVBQUU7QUFDZCxXQUFLLElBQUksYUFBYSxJQUFJLFVBQVUsRUFBRTtBQUNwQyxZQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxHQUFHLEdBQUcsYUFBYSxDQUFDLENBQUM7T0FDckc7S0FDRjtHQUNGOzs7Ozs7OztBQVFELE9BQUssRUFBRSxlQUFTLFFBQVEsRUFBRSxRQUFRLEVBQUU7O0FBRWxDLFlBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQyxRQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs7O0FBSTlDLFlBQVEsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRWhELFFBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQzNCLFlBQU0sSUFBSSxLQUFLLENBQUMseUNBQXlDLENBQUMsQ0FBQztLQUM1RDs7O0FBR0QsWUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsVUFBUyxHQUFHLEVBQUUsS0FBSyxFQUFFO0FBQzVDLGNBQVEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDdEIsQ0FBQyxDQUFDO0dBQ0o7Ozs7Ozs7OztBQVNELGlCQUFlLEVBQUUseUJBQVMsUUFBUSxFQUFFO0FBQ2xDLFFBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDOzs7QUFHdEMsUUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7Ozs7O0FBSy9CLFFBQUksVUFBVSxFQUFFO0FBQ2QsV0FBSyxJQUFJLGFBQWEsSUFBSSxVQUFVLEVBQUU7QUFDcEMsWUFBSSxjQUFjLEdBQUcsSUFBSSxNQUFNLENBQUMsR0FBRyxHQUFHLGFBQWEsQ0FBQyxDQUFDO0FBQ3JELFlBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUNqQyxrQkFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDdEM7T0FDRjtLQUNGOztBQUVELFdBQU8sUUFBUSxDQUFDO0dBQ2pCOzs7Ozs7Ozs7QUFTRCx1QkFBcUIsRUFBRSwrQkFBUyxRQUFRLEVBQUU7QUFDeEMsUUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDdEMsUUFBSSxVQUFVLEVBQUU7QUFDZCxXQUFLLElBQUksYUFBYSxJQUFJLFVBQVUsRUFBRTtBQUNwQyxZQUFJLGNBQWMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLEdBQUcsYUFBYSxDQUFDLENBQUM7QUFDckQsWUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQ2pDLGtCQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDakQ7T0FDRjtLQUNGOzs7QUFHRCxZQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDdkMsV0FBTyxRQUFRLENBQUM7R0FDakI7O0NBRUYsQ0FBQyxDQUFDOzs7Ozs7QUFNSCxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyIsImZpbGUiOiIvaG9tZS9hbmRyZWkvLmF0b20vcGFja2FnZXMvZ2l0LWJsYW1lL2xpYi91dGlsL2JsYW1lci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG5jb25zdCBHaXRDb21tYW5kZXIgPSByZXF1aXJlKCcuL2dpdENvbW1hbmRlcicpO1xuXG4vKipcbiAqIEBtb2R1bGUgQmxhbWVyXG4gKlxuICogQmxhbWVyIGlzIGEgQ2xhc3MgdGhhdCBzaG91bGQgYmUgaW5zdGFudGlhdGVkIHdpdGggYW4gYXRvbSAnR2l0JyBvYmplY3RcbiAqIGZvciB0aGUgcm9vdCByZXBvc2l0b3J5IGluIHRoZSBwcm9qZWN0LlxuICpcbiAqIEBwYXJhbSB7R2l0fSByZXBvIC0gYW4gaW5zdGFuY2Ugb2YgJ0dpdCcgY2xhc3MgZnJvbSBhdG9tIHdvcmtzcGFjZS4gU2VlXG4gKiAgIGh0dHBzOi8vYXRvbS5pby9kb2NzL2FwaS92MC45Mi4wL2FwaS8gZm9yIG1vcmUgaW5mby5cbiAqL1xudmFyIEJsYW1lciA9IGZ1bmN0aW9uKHJlcG8pIHtcbiAgaWYgKCFyZXBvKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIGEgQmxhbWVyIHdpdGhvdXQgYSByZXBvc2l0b3J5LicpO1xuICB9XG5cbiAgdGhpcy5yZXBvID0gcmVwbztcbiAgdGhpcy5pbml0aWFsaXplKCk7XG59O1xuXG4vLyA9PT09PT09PT09PT09PT09XG4vLyBJbnN0YW5jZSBNZXRob2RzXG4vLyA9PT09PT09PT09PT09PT09XG5cbl8uZXh0ZW5kKEJsYW1lci5wcm90b3R5cGUsIHtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhpcyBCbGFtZXIgaW5zdGFuY2UsIGJ5IGNyZWF0aW5nIGdpdC10b29scyByZXBvcyBmb3IgdGhlIHJvb3RcbiAgICogcmVwb3NpdG9yeSBhbmQgc3VibW9kdWxlcy5cbiAgICovXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudG9vbHMgPSB7fTtcbiAgICB0aGlzLnRvb2xzLnJvb3QgPSBuZXcgR2l0Q29tbWFuZGVyKHRoaXMucmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpO1xuXG4gICAgdmFyIHN1Ym1vZHVsZXMgPSB0aGlzLnJlcG8uc3VibW9kdWxlcztcbiAgICBpZiAoc3VibW9kdWxlcykge1xuICAgICAgZm9yICh2YXIgc3VibW9kdWxlUGF0aCBpbiBzdWJtb2R1bGVzKSB7XG4gICAgICAgIHRoaXMudG9vbHNbc3VibW9kdWxlUGF0aF0gPSBuZXcgR2l0Q29tbWFuZGVyKHRoaXMucmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkgKyAnLycgKyBzdWJtb2R1bGVQYXRoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEJsYW1lcyB0aGUgZ2l2ZW4gZmlsZVBhdGggYW5kIGNhbGxzIGNhbGxiYWNrIHdpdGggYmxhbWUgbGluZXMgb3IgZXJyb3IuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aCAtIGZpbGVQYXRoIHRvIGJsYW1lXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gY2FsbGJhY2sgdG8gY2FsbCBiYWNrIHdpdGggYmxhbWUgZGF0YVxuICAgKi9cbiAgYmxhbWU6IGZ1bmN0aW9uKGZpbGVQYXRoLCBjYWxsYmFjaykge1xuICAgIC8vIEVuc3VyZSBmaWxlIHBhdGggaXMgcmVsYXRpdmUgdG8gcm9vdCByZXBvXG4gICAgZmlsZVBhdGggPSB0aGlzLnJlcG8ucmVsYXRpdml6ZShmaWxlUGF0aCk7XG4gICAgdmFyIHJlcG9VdGlsID0gdGhpcy5yZXBvVXRpbEZvclBhdGgoZmlsZVBhdGgpO1xuXG4gICAgLy8gRW5zdXJlIHRoYXQgaWYgdGhpcyBmaWxlIGlzIGluIGEgc3VibW9kdWxlLCB3ZSByZW1vdmUgdGhlIHN1Ym1vZHVsZSBkaXJcbiAgICAvLyBmcm9tIHRoZSBwYXRoXG4gICAgZmlsZVBhdGggPSB0aGlzLnJlbW92ZVN1Ym1vZHVsZVByZWZpeChmaWxlUGF0aCk7XG5cbiAgICBpZiAoIV8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTXVzdCBiZSBjYWxsZWQgd2l0aCBhIGNhbGxiYWNrIGZ1bmN0aW9uJyk7XG4gICAgfVxuXG4gICAgLy8gTWFrZSB0aGUgYXN5bmMgYmxhbWUgY2FsbCBvbiB0aGUgZ2l0IHJlcG9cbiAgICByZXBvVXRpbC5ibGFtZShmaWxlUGF0aCwgZnVuY3Rpb24oZXJyLCBibGFtZSkge1xuICAgICAgY2FsbGJhY2soZXJyLCBibGFtZSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFV0aWxpdHkgdG8gZ2V0IHRoZSBHaXRDb21tYW5kZXIgcmVwb3NpdG9yeSBmb3IgdGhlIGdpdmVuIGZpbGVQYXRoLiBUYWtlcyBpbnRvXG4gICAqIGFjY291bnQgd2hldGhlciB0aGUgZmlsZSBpcyBwYXJ0IG9mIGEgc3VibW9kdWxlIGFuZCByZXR1cm5zIHRoYXQgcmVwb3NpdG9yeVxuICAgKiBpZiBuZWNlc3NhcnkuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aCAtIHRoZSBwYXRoIHRvIHRoZSBmaWxlIGluIHF1ZXN0aW9uLlxuICAgKi9cbiAgcmVwb1V0aWxGb3JQYXRoOiBmdW5jdGlvbihmaWxlUGF0aCkge1xuICAgIHZhciBzdWJtb2R1bGVzID0gdGhpcy5yZXBvLnN1Ym1vZHVsZXM7XG5cbiAgICAvLyBCeSBkZWZhdWx0LCB3ZSByZXR1cm4gdGhlIHJvb3QgR2l0Q29tbWFuZGVyIHJlcG9zaXRvcnkuXG4gICAgdmFyIHJlcG9VdGlsID0gdGhpcy50b29scy5yb290O1xuXG4gICAgLy8gaWYgd2UgaGF2ZSBzdWJtb2R1bGVzLCBsb29wIHRocm91Z2ggdGhlbSBhbmQgc2VlIGlmIHRoZSBnaXZlbiBmaWxlIHBhdGhcbiAgICAvLyBiZWxvbmdzIGluc2lkZSBvbmUgb2YgdGhlIHJlcG9zaXRvcmllcy4gSWYgc28sIHdlIHJldHVybiB0aGUgR2l0Q29tbWFuZGVyIHJlcG9cbiAgICAvLyBmb3IgdGhhdCBzdWJtb2R1bGUuXG4gICAgaWYgKHN1Ym1vZHVsZXMpIHtcbiAgICAgIGZvciAodmFyIHN1Ym1vZHVsZVBhdGggaW4gc3VibW9kdWxlcykge1xuICAgICAgICB2YXIgc3VibW9kdWxlUmVnZXggPSBuZXcgUmVnRXhwKCdeJyArIHN1Ym1vZHVsZVBhdGgpO1xuICAgICAgICBpZiAoc3VibW9kdWxlUmVnZXgudGVzdChmaWxlUGF0aCkpIHtcbiAgICAgICAgICByZXBvVXRpbCA9IHRoaXMudG9vbHNbc3VibW9kdWxlUGF0aF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVwb1V0aWw7XG4gIH0sXG5cbiAgLyoqXG4gICAqIElmIHRoZSBmaWxlIHBhdGggZ2l2ZW4gaXMgaW5zaWRlIGEgc3VibW9kdWxlLCByZW1vdmVzIHRoZSBzdWJtb2R1bGVcbiAgICogZGlyZWN0b3J5IHByZWZpeC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoIC0gcGF0aCB0byBmaWxlIHRvIHJlbGF0aXZpemVcbiAgICogQHBhcmFtIHtSZXBvfSB0b29sc1JlcG8gLSBnaXQtdG9vbHMgUmVwb1xuICAgKi9cbiAgcmVtb3ZlU3VibW9kdWxlUHJlZml4OiBmdW5jdGlvbihmaWxlUGF0aCkge1xuICAgIHZhciBzdWJtb2R1bGVzID0gdGhpcy5yZXBvLnN1Ym1vZHVsZXM7XG4gICAgaWYgKHN1Ym1vZHVsZXMpIHtcbiAgICAgIGZvciAodmFyIHN1Ym1vZHVsZVBhdGggaW4gc3VibW9kdWxlcykge1xuICAgICAgICB2YXIgc3VibW9kdWxlUmVnZXggPSBuZXcgUmVnRXhwKCdeJyArIHN1Ym1vZHVsZVBhdGgpO1xuICAgICAgICBpZiAoc3VibW9kdWxlUmVnZXgudGVzdChmaWxlUGF0aCkpIHtcbiAgICAgICAgICBmaWxlUGF0aCA9IGZpbGVQYXRoLnJlcGxhY2Uoc3VibW9kdWxlUmVnZXgsICcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlbW92ZSBsZWFkaW5nICcvJyBpZiB0aGVyZSBpcyBvbmUgYmVmb3JlIHJldHVybmluZ1xuICAgIGZpbGVQYXRoID0gZmlsZVBhdGgucmVwbGFjZSgvXlxcLy8sICcnKTtcbiAgICByZXR1cm4gZmlsZVBhdGg7XG4gIH1cblxufSk7XG5cbi8vID09PT09PT09PT09PT09PT1cbi8vIEV4cG9ydHNcbi8vID09PT09PT09PT09PT09PT1cblxubW9kdWxlLmV4cG9ydHMgPSBCbGFtZXI7XG4iXX0=