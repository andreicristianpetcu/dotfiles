(function() {
  var LinterTern;

  LinterTern = (function() {
    LinterTern.prototype.grammarScopes = ['source.js'];

    LinterTern.prototype.scope = 'file';

    LinterTern.prototype.lintOnFly = true;

    LinterTern.prototype.manager = null;

    function LinterTern(manager) {
      this.manager = manager;
      if (!this.manager) {
        return;
      }
    }

    LinterTern.prototype.lint = function(textEditor) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var URI, buffer, messages, text, _ref, _ref1;
          messages = [];
          if (!(_this.manager.server && _this.manager.useLint && _this.manager.config.config)) {
            return resolve([]);
          }
          if (!((_ref = _this.manager.config.config.plugins.lint) != null ? _ref.active : void 0)) {
            return resolve([]);
          }
          buffer = textEditor.getBuffer();
          URI = textEditor.getURI();
          text = textEditor.getText();
          return (_ref1 = _this.manager.client) != null ? _ref1.update(URI, text).then(function() {
            return _this.manager.client.lint(URI, text).then(function(data) {
              var message, positionFrom, positionTo, _i, _len, _ref2;
              if (!data.messages) {
                return resolve([]);
              }
              _ref2 = data.messages;
              for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
                message = _ref2[_i];
                positionFrom = buffer.positionForCharacterIndex(message.from);
                positionTo = buffer.positionForCharacterIndex(message.to);
                messages.push({
                  text: message.message,
                  type: message.severity,
                  filePath: buffer.file.path,
                  range: [[positionFrom.row, positionFrom.column], [positionTo.row, positionTo.column]]
                });
              }
              return resolve(messages);
            });
          }) : void 0;
        };
      })(this));
    };

    return LinterTern;

  })();

  module.exports = LinterTern;

}).call(this);
