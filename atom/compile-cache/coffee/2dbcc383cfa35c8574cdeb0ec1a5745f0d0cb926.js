(function() {
  var AtomGitDiffDetailsView;

  AtomGitDiffDetailsView = require("./git-diff-details-view");

  module.exports = {
    config: {
      closeAfterCopy: {
        type: "boolean",
        "default": false,
        title: "Close diff view after copy"
      },
      keepViewToggled: {
        type: "boolean",
        "default": true,
        title: "Keep view toggled when leaving a diff"
      }
    },
    activate: function() {
      return atom.workspace.observeTextEditors(function(editor) {
        return new AtomGitDiffDetailsView(editor);
      });
    }
  };

}).call(this);
