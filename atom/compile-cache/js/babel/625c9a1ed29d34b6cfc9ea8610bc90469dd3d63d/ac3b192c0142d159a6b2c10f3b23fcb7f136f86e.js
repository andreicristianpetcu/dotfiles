var Blamer = require('./util/blamer');
var BlameViewController = require('./controllers/blameViewController');
var errorController = require('./controllers/errorController');
var Directory = require('pathwatcher').Directory;
var path = require('path');

// reference to the Blamer instance created in initializeContext if this
// project is backed by a git repository.
var projectBlamers = {};

function activate() {
  // git-blame:blame
  atom.commands.add('atom-workspace', 'git-blame:toggle', toggleBlame);
}

function toggleBlame() {
  var editor = atom.workspace.getActivePaneItem();
  if (!editor) return;

  // An unsaved file has no filePath
  filePath = editor.getPath();
  if (!filePath) return;

  // blaming an empty file is useless
  if (editor.isEmpty()) return;

  return atom.project.repositoryForDirectory(new Directory(path.dirname(filePath))).then(function (projectRepo) {
    // Ensure this project is backed by a git repository
    if (!projectRepo) {
      errorController.showError('error-not-backed-by-git');
      return;
    }

    if (!(projectRepo.path in projectBlamers)) {
      projectBlamers[projectRepo.path] = new Blamer(projectRepo);
    }

    BlameViewController.toggleBlame(projectBlamers[projectRepo.path]);
  });
}

// EXPORTS
module.exports = {
  config: {
    "useCustomUrlTemplateIfStandardRemotesFail": {
      type: 'boolean',
      'default': false
    },
    "customCommitUrlTemplateString": {
      type: 'string',
      'default': 'Example -> https://github.com/<%- project %>/<%- repo %>/commit/<%- revision %>'
    },
    "dateFormatString": {
      type: 'string',
      'default': 'YYYY-MM-DD'
    },
    "ignoreWhiteSpaceDiffs": {
      type: 'boolean',
      'default': false
    }
  },

  toggleBlame: toggleBlame,
  activate: activate
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FuZHJlaS8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL2dpdC1ibGFtZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDeEMsSUFBTSxtQkFBbUIsR0FBRyxPQUFPLENBQUMsbUNBQW1DLENBQUMsQ0FBQztBQUN6RSxJQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQUNqRSxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsU0FBUyxDQUFBO0FBQ2xELElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7OztBQUk3QixJQUFJLGNBQWMsR0FBRyxFQUFFLENBQUE7O0FBRXZCLFNBQVMsUUFBUSxHQUFHOztBQUVsQixNQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRSxXQUFXLENBQUMsQ0FBQztDQUN0RTs7QUFHRCxTQUFTLFdBQVcsR0FBRztBQUNyQixNQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixFQUFFLENBQUE7QUFDL0MsTUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPOzs7QUFHcEIsVUFBUSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUMzQixNQUFJLENBQUMsUUFBUSxFQUFFLE9BQU87OztBQUd0QixNQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRSxPQUFPOztBQUU3QixTQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUNwRixVQUFTLFdBQVcsRUFBRTs7QUFFcEIsUUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNoQixxQkFBZSxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQ3JELGFBQU87S0FDUjs7QUFFRCxRQUFJLEVBQUUsV0FBVyxDQUFDLElBQUksSUFBSSxjQUFjLENBQUEsQUFBQyxFQUFFO0FBQ3pDLG9CQUFjLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQzVEOztBQUVELHVCQUFtQixDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7R0FDbkUsQ0FBQyxDQUFDO0NBRU47OztBQUlELE1BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDZixRQUFNLEVBQUU7QUFDTiwrQ0FBMkMsRUFBRTtBQUMzQyxVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLEtBQUs7S0FDZjtBQUNELG1DQUErQixFQUFFO0FBQy9CLFVBQUksRUFBRSxRQUFRO0FBQ2QsaUJBQVMsaUZBQWlGO0tBQzNGO0FBQ0Qsc0JBQWtCLEVBQUU7QUFDbEIsVUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBUyxZQUFZO0tBQ3RCO0FBQ0QsMkJBQXVCLEVBQUU7QUFDdkIsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxLQUFLO0tBQ2Y7R0FDRjs7QUFFRCxhQUFXLEVBQUUsV0FBVztBQUN4QixVQUFRLEVBQUUsUUFBUTtDQUNuQixDQUFDIiwiZmlsZSI6Ii9ob21lL2FuZHJlaS8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL2dpdC1ibGFtZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEJsYW1lciA9IHJlcXVpcmUoJy4vdXRpbC9ibGFtZXInKTtcbmNvbnN0IEJsYW1lVmlld0NvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL2JsYW1lVmlld0NvbnRyb2xsZXInKTtcbmNvbnN0IGVycm9yQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvZXJyb3JDb250cm9sbGVyJyk7XG5jb25zdCBEaXJlY3RvcnkgPSByZXF1aXJlKCdwYXRod2F0Y2hlcicpLkRpcmVjdG9yeVxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxuLy8gcmVmZXJlbmNlIHRvIHRoZSBCbGFtZXIgaW5zdGFuY2UgY3JlYXRlZCBpbiBpbml0aWFsaXplQ29udGV4dCBpZiB0aGlzXG4vLyBwcm9qZWN0IGlzIGJhY2tlZCBieSBhIGdpdCByZXBvc2l0b3J5LlxudmFyIHByb2plY3RCbGFtZXJzID0ge31cblxuZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gIC8vIGdpdC1ibGFtZTpibGFtZVxuICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnZ2l0LWJsYW1lOnRvZ2dsZScsIHRvZ2dsZUJsYW1lKTtcbn1cblxuXG5mdW5jdGlvbiB0b2dnbGVCbGFtZSgpIHtcbiAgdmFyIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKClcbiAgaWYgKCFlZGl0b3IpIHJldHVybjtcblxuICAvLyBBbiB1bnNhdmVkIGZpbGUgaGFzIG5vIGZpbGVQYXRoXG4gIGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICBpZiAoIWZpbGVQYXRoKSByZXR1cm47XG5cbiAgLy8gYmxhbWluZyBhbiBlbXB0eSBmaWxlIGlzIHVzZWxlc3NcbiAgaWYgKGVkaXRvci5pc0VtcHR5KCkpIHJldHVybjtcblxuICByZXR1cm4gYXRvbS5wcm9qZWN0LnJlcG9zaXRvcnlGb3JEaXJlY3RvcnkobmV3IERpcmVjdG9yeShwYXRoLmRpcm5hbWUoZmlsZVBhdGgpKSkudGhlbihcbiAgICBmdW5jdGlvbihwcm9qZWN0UmVwbykge1xuICAgICAgLy8gRW5zdXJlIHRoaXMgcHJvamVjdCBpcyBiYWNrZWQgYnkgYSBnaXQgcmVwb3NpdG9yeVxuICAgICAgaWYgKCFwcm9qZWN0UmVwbykge1xuICAgICAgICBlcnJvckNvbnRyb2xsZXIuc2hvd0Vycm9yKCdlcnJvci1ub3QtYmFja2VkLWJ5LWdpdCcpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghKHByb2plY3RSZXBvLnBhdGggaW4gcHJvamVjdEJsYW1lcnMpKSB7XG4gICAgICAgIHByb2plY3RCbGFtZXJzW3Byb2plY3RSZXBvLnBhdGhdID0gbmV3IEJsYW1lcihwcm9qZWN0UmVwbyk7XG4gICAgICB9XG5cbiAgICAgIEJsYW1lVmlld0NvbnRyb2xsZXIudG9nZ2xlQmxhbWUocHJvamVjdEJsYW1lcnNbcHJvamVjdFJlcG8ucGF0aF0pO1xuICAgIH0pO1xuXG59XG5cblxuLy8gRVhQT1JUU1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvbmZpZzoge1xuICAgIFwidXNlQ3VzdG9tVXJsVGVtcGxhdGVJZlN0YW5kYXJkUmVtb3Rlc0ZhaWxcIjoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIFwiY3VzdG9tQ29tbWl0VXJsVGVtcGxhdGVTdHJpbmdcIjoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnRXhhbXBsZSAtPiBodHRwczovL2dpdGh1Yi5jb20vPCUtIHByb2plY3QgJT4vPCUtIHJlcG8gJT4vY29tbWl0LzwlLSByZXZpc2lvbiAlPidcbiAgICB9LFxuICAgIFwiZGF0ZUZvcm1hdFN0cmluZ1wiOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdZWVlZLU1NLUREJ1xuICAgIH0sXG4gICAgXCJpZ25vcmVXaGl0ZVNwYWNlRGlmZnNcIjoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9XG4gIH0sXG5cbiAgdG9nZ2xlQmxhbWU6IHRvZ2dsZUJsYW1lLFxuICBhY3RpdmF0ZTogYWN0aXZhdGVcbn07XG4iXX0=