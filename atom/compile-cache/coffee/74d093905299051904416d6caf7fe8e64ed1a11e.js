(function() {
  var $$, GitLogView, InfoPanelView, MainPanelView, ScrollView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, ScrollView = _ref.ScrollView, View = _ref.View;

  module.exports = GitLogView = (function(_super) {
    __extends(GitLogView, _super);

    GitLogView.content = function() {
      return this.div({
        "class": 'git-log',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.subview('main_panel', new MainPanelView);
          return _this.subview('info_panel', new InfoPanelView);
        };
      })(this));
    };

    function GitLogView() {
      GitLogView.__super__.constructor.apply(this, arguments);
    }

    return GitLogView;

  })(View);

  MainPanelView = (function(_super) {
    __extends(MainPanelView, _super);

    function MainPanelView() {
      return MainPanelView.__super__.constructor.apply(this, arguments);
    }

    MainPanelView.content = function() {
      return this.div({
        "class": 'main panels',
        cellpadding: 0,
        cellspacing: 0,
        border: 0,
        outlet: 'main_panel'
      }, (function(_this) {
        return function() {
          return _this.table(function() {
            _this.div({
              "class": 'graph',
              outlet: 'graph'
            });
            _this.thead(function() {
              return _this.tr(function() {
                _this.th({
                  "class": 'graph-col'
                }, function() {
                  return _this.p('Graph');
                });
                _this.th({
                  "class": 'comments',
                  outlet: 'comments'
                }, function() {
                  return _this.p('Description');
                });
                _this.th({
                  "class": 'commit',
                  outlet: 'commit'
                }, function() {
                  return _this.p('Commit');
                });
                _this.th({
                  "class": 'date',
                  outlet: 'date'
                }, function() {
                  return _this.p('Date');
                });
                return _this.th({
                  "class": 'author',
                  outlet: 'author'
                }, function() {
                  return _this.p('Author');
                });
              });
            });
            return _this.tbody({
              outlet: 'body'
            });
          });
        };
      })(this));
    };

    MainPanelView.prototype.initialize = function() {
      return MainPanelView.__super__.initialize.apply(this, arguments);
    };

    return MainPanelView;

  })(ScrollView);

  InfoPanelView = (function(_super) {
    __extends(InfoPanelView, _super);

    function InfoPanelView() {
      return InfoPanelView.__super__.constructor.apply(this, arguments);
    }

    InfoPanelView.content = function() {
      return this.div({
        "class": 'info panels'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'info-data',
            outlet: 'info_data'
          });
          _this.div({
            "class": 'info-image',
            outlet: 'info_image'
          });
          return _this.div({
            "class": 'info-file',
            outlet: 'info_file'
          }, function() {
            return _this.table(function() {
              _this.thead(function() {
                return _this.tr(function() {
                  _this.th({
                    "class": 'stat',
                    outlet: 'status'
                  }, function() {
                    return _this.p('Status');
                  });
                  _this.th({
                    "class": 'file',
                    outlet: 'name'
                  }, function() {
                    return _this.p('Filename');
                  });
                  _this.th({
                    "class": 'path',
                    outlet: 'path'
                  }, function() {
                    return _this.p('Path');
                  });
                  _this.th({
                    "class": 'add',
                    outlet: 'addition'
                  }, function() {
                    return _this.p('Addition');
                  });
                  return _this.th({
                    "class": 'del',
                    outlet: 'deletion'
                  }, function() {
                    return _this.p('Deletion');
                  });
                });
              });
              return _this.tbody({
                outlet: 'body'
              });
            });
          });
        };
      })(this));
    };

    InfoPanelView.prototype.add_content = function(head, content) {
      return this.info_data.append($$(function() {
        return this.h2((function(_this) {
          return function() {
            _this.text(head);
            return _this.span(content);
          };
        })(this));
      }));
    };

    return InfoPanelView;

  })(ScrollView);


  /*
  class MainPanelView extends ScrollView
      @content:->
          @div class: 'main panels', =>
                  @subview 'graph', new ColumnView('Graph', 'graph')
                  @div class: 'table', outlet: 'table', =>
                      @subview 'comments', new ColumnView('Description', 'comments', true)
                      @subview 'commit', new ColumnView('Commit', 'commit', true)
                      @subview 'date', new ColumnView('Date', 'date', true)
                      @subview 'author', new ColumnView('Author', 'author')
  
  
  class InfoPanelView extends ScrollView
      @content: ->
          @div class: 'info panels', =>
              @div class: 'info-data', outlet: 'info_data'
              @div class: 'info-image', outlet: 'info_image'
              @div class:'info-file', outlet: 'info_file', =>
                  @subview 'status', new ColumnView('Status', 'status')
                  @subview 'name', new ColumnView('Filename', 'file')
                  @subview 'path', new ColumnView('Path', 'path')
                  @subview 'addition', new ColumnView('Addition', 'add')
                  @subview 'deletion', new ColumnView('Deletion', 'del')
  
      add_content: (head, content) ->
          @info_data.append $$ ->
              @h2 =>
                  @text head
                  @span content
  
  
  class ColumnView extends View
      @content: (title, class_name, resizable) ->
          @div class: 'column ' + class_name, =>
              @div class: 'list-head', =>
                  @h2 title
                  @div class:'resize-handle' if resizable
              @div class: 'list', outlet: 'list'
  
      add_content: (content) ->
          @list.append $$ ->
              @p =>
                  @span content
   */

}).call(this);
