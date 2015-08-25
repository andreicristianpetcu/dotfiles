(function() {
  var CommandHistory;

  CommandHistory = (function() {
    function CommandHistory(editor) {
      this.editor = editor;
      this.cmdHistory = [];
    }

    CommandHistory.prototype.saveIfNew = function(text) {
      if (!((this.cmdHistoryIndex != null) && this.cmdHistory[this.cmdHistoryIndex] === text)) {
        this.cmdHistoryIndex = this.cmdHistory.length;
        this.cmdHistory.push(text);
      }
      return this.historyMode = false;
    };

    CommandHistory.prototype.moveUp = function() {
      if (this.cmdHistoryIndex == null) {
        return;
      }
      if (this.cmdHistoryIndex > 0 && this.historyMode) {
        this.cmdHistoryIndex--;
      }
      this.editor.setText(this.cmdHistory[this.cmdHistoryIndex]);
      return this.historyMode = true;
    };

    CommandHistory.prototype.moveDown = function() {
      if (this.cmdHistoryIndex == null) {
        return;
      }
      if (!this.historyMode) {
        return;
      }
      if (this.cmdHistoryIndex < this.cmdHistory.length - 1 && this.historyMode) {
        this.cmdHistoryIndex++;
      }
      return this.editor.setText(this.cmdHistory[this.cmdHistoryIndex]);
    };

    return CommandHistory;

  })();

  exports.CommandHistory = CommandHistory;

}).call(this);
