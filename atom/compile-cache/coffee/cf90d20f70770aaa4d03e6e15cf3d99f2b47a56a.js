(function() {
  var Reference, ReferenceView, TextBuffer, fs, path, _;

  ReferenceView = require('./atom-ternjs-reference-view');

  _ = require('underscore-plus');

  fs = require('fs');

  path = require('path');

  TextBuffer = require('atom').TextBuffer;

  module.exports = Reference = (function() {
    Reference.prototype.reference = null;

    Reference.prototype.manager = null;

    Reference.prototype.references = [];

    function Reference(manager, state) {
      if (state == null) {
        state = {};
      }
      this.manager = manager;
      this.reference = new ReferenceView();
      this.reference.initialize(this);
      this.referencePanel = atom.workspace.addBottomPanel({
        item: this.reference,
        priority: 0
      });
      this.referencePanel.hide();
      atom.views.getView(this.referencePanel).classList.add('atom-ternjs-reference-panel', 'panel-bottom');
      this.registerEvents();
    }

    Reference.prototype.registerEvents = function() {
      var close;
      close = this.reference.getClose();
      return close.addEventListener('click', (function(_this) {
        return function(e) {
          var editor, view;
          _this.hide();
          editor = atom.workspace.getActiveTextEditor();
          if (!editor) {
            return;
          }
          view = atom.views.getView(editor);
          return view != null ? typeof view.focus === "function" ? view.focus() : void 0 : void 0;
        };
      })(this));
    };

    Reference.prototype.goToReference = function(idx) {
      var editor, ref;
      editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return;
      }
      ref = this.references.refs[idx];
      return this.manager.helper.openFileAndGoTo(ref.start, ref.file);
    };

    Reference.prototype.findReference = function() {
      var cursor, editor, position;
      if (!this.manager.client) {
        return;
      }
      editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return;
      }
      cursor = editor.getLastCursor();
      position = cursor.getBufferPosition();
      return this.manager.client.refs(editor.getURI(), {
        line: position.row,
        ch: position.column
      }).then((function(_this) {
        return function(data) {
          var ref, _i, _len, _ref;
          _this.references = data;
          _ref = data.refs;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            ref = _ref[_i];
            ref.file = ref.file.replace(/^.\//, '');
            ref.file = path.resolve(atom.project.relativizePath(_this.manager.server.rootPath)[0], ref.file);
          }
          data.refs = _.uniq(data.refs, function(item) {
            return JSON.stringify(item);
          });
          data = _this.gatherMeta(data);
          _this.referencePanel.show();
          return _this.reference.buildItems(data);
        };
      })(this));
    };

    Reference.prototype.gatherMeta = function(data) {
      var buffer, content, i, item, _i, _len, _ref;
      _ref = data.refs;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        item = _ref[i];
        content = fs.readFileSync(item.file, 'utf8');
        buffer = new TextBuffer({
          text: content
        });
        item.position = buffer.positionForCharacterIndex(item.start);
        item.lineText = buffer.lineForRow(item.position.row);
        item.lineText = item.lineText.replace(data.name, "<strong>" + data.name + "</strong>");
        buffer.destroy();
      }
      return data;
    };

    Reference.prototype.hide = function() {
      return this.referencePanel.hide();
    };

    Reference.prototype.show = function() {
      return this.referencePanel.show();
    };

    Reference.prototype.destroy = function() {
      var _ref, _ref1;
      if ((_ref = this.reference) != null) {
        _ref.destroy();
      }
      this.reference = null;
      if ((_ref1 = this.referencePanel) != null) {
        _ref1.destroy();
      }
      return this.referencePanel = null;
    };

    return Reference;

  })();

}).call(this);
