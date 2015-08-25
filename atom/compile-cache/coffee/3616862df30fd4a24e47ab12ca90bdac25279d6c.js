(function() {
  var $panel, $root, App, isInited;

  App = require('./Components/App');

  $root = null;

  $panel = null;

  isInited = false;

  exports.show = function(_debugger) {
    if (!isInited) {
      $root = document.createElement('div');
      App.start($root, _debugger);
    }
    $panel = atom.workspace.addBottomPanel({
      item: $root
    });
    return isInited = true;
  };

  exports.hide = function() {
    if (!$panel) {
      return;
    }
    $panel.destroy();
    return atom.workspace.getActivePane().activate();
  };

  exports.destroy = function() {
    exports.hide();
    App.stop();
    isInited = false;
    if ($root != null) {
      $root.remove();
    }
    return $root = null;
  };

}).call(this);
