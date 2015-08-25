(function() {
  var $, BlameLineComponent, BlameListLinesComponent, BlameListView, RP, React, Reactionary, div, renderLoading, _, _ref;

  $ = require('atom-space-pen-views').$;

  React = require('react-atom-fork');

  Reactionary = require('reactionary-atom-fork');

  div = Reactionary.div;

  RP = React.PropTypes;

  _ = require('underscore');

  _ref = require('./blame-line-view'), BlameLineComponent = _ref.BlameLineComponent, renderLoading = _ref.renderLoading;

  BlameListLinesComponent = React.createClass({
    propTypes: {
      annotations: RP.arrayOf(RP.object),
      loading: RP.bool.isRequired,
      dirty: RP.bool.isRequired,
      initialLineCount: RP.number.isRequired,
      remoteRevision: RP.object.isRequired
    },
    renderLoading: function() {
      var lines, _i, _ref1, _results;
      lines = (function() {
        _results = [];
        for (var _i = 0, _ref1 = this.props.initialLineCount; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; 0 <= _ref1 ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).map(renderLoading);
      return div(null, lines);
    },
    _addAlternatingBackgroundColor: function(lines) {
      var bgClass, lastHash, line, _i, _len;
      bgClass = null;
      lastHash = null;
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        bgClass = line.noCommit ? '' : line.hash === lastHash ? bgClass : bgClass === 'line-bg-lighter' ? 'line-bg-darker' : 'line-bg-lighter';
        line['backgroundClass'] = bgClass;
        lastHash = line.hash;
      }
      return lines;
    },
    renderLoaded: function() {
      var l, lines, _i, _len;
      lines = _.clone(this.props.annotations);
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        l = lines[_i];
        l.remoteRevision = this.props.remoteRevision;
      }
      this._addAlternatingBackgroundColor(lines);
      return div(null, lines.map(BlameLineComponent));
    },
    render: function() {
      if (this.props.loading) {
        return this.renderLoading();
      } else {
        return this.renderLoaded();
      }
    },
    shouldComponentUpdate: function(_arg) {
      var dirty, finishedEdit, finishedInitialLoad, loading;
      loading = _arg.loading, dirty = _arg.dirty;
      finishedInitialLoad = this.props.loading && !loading && !this.props.dirty;
      finishedEdit = this.props.dirty && !dirty;
      return finishedInitialLoad || finishedEdit;
    }
  });

  BlameListView = React.createClass({
    propTypes: {
      projectBlamer: RP.object.isRequired,
      remoteRevision: RP.object.isRequired,
      editorView: RP.object.isRequired
    },
    getInitialState: function() {
      return {
        scrollTop: this.scrollbar().scrollTop(),
        width: 210,
        loading: true,
        visible: true,
        dirty: false
      };
    },
    scrollbar: function() {
      var _ref1;
      return this._scrollbar != null ? this._scrollbar : this._scrollbar = $((_ref1 = this.props.editorView.rootElement) != null ? _ref1.querySelector('.vertical-scrollbar') : void 0);
    },
    editor: function() {
      return this._editor != null ? this._editor : this._editor = this.props.editorView.getModel();
    },
    render: function() {
      var body, display;
      display = this.state.visible ? 'inline-block' : 'none';
      body = this.state.error ? div("Sorry, an error occurred.") : div({
        className: 'git-blame-scroller'
      }, div({
        className: 'blame-lines',
        style: {
          WebkitTransform: this.getTransform()
        }
      }, BlameListLinesComponent({
        annotations: this.state.annotations,
        loading: this.state.loading,
        dirty: this.state.dirty,
        initialLineCount: this.editor().getLineCount(),
        remoteRevision: this.props.remoteRevision
      })));
      return div({
        className: 'git-blame',
        style: {
          width: this.state.width,
          display: display
        }
      }, div({
        className: 'git-blame-resize-handle',
        onMouseDown: this.resizeStarted
      }), body);
    },
    getTransform: function() {
      var scrollTop, useHardwareAcceleration;
      scrollTop = this.state.scrollTop;
      useHardwareAcceleration = false;
      if (useHardwareAcceleration) {
        return "translate3d(0px, " + (-scrollTop) + "px, 0px)";
      } else {
        return "translate(0px, " + (-scrollTop) + "px)";
      }
    },
    componentWillMount: function() {
      this.loadBlame();
      this.editor().onDidStopChanging(this.contentsModified);
      return this.editor().onDidSave(this.saved);
    },
    loadBlame: function() {
      this.setState({
        loading: true
      });
      return this.props.projectBlamer.blame(this.editor().getPath(), (function(_this) {
        return function(err, data) {
          if (err) {
            return _this.setState({
              loading: false,
              error: true,
              dirty: false
            });
          } else {
            return _this.setState({
              loading: false,
              error: false,
              dirty: false,
              annotations: data
            });
          }
        };
      })(this));
    },
    contentsModified: function() {
      if (!this.isMounted()) {
        return;
      }
      if (!this.state.dirty) {
        return this.setState({
          dirty: true
        });
      }
    },
    saved: function() {
      if (!this.isMounted()) {
        return;
      }
      if (this.state.visible && this.state.dirty) {
        return this.loadBlame();
      }
    },
    toggle: function() {
      if (this.state.visible) {
        return this.setState({
          visible: false
        });
      } else {
        if (this.state.dirty) {
          this.loadBlame();
        }
        return this.setState({
          visible: true
        });
      }
    },
    componentDidMount: function() {
      return this.scrollbar().on('scroll', this.matchScrollPosition);
    },
    componentWillUnmount: function() {
      this.scrollbar().off('scroll', this.matchScrollPosition);
      this.editor().off('contents-modified', this.contentsModified);
      return this.editor().buffer.off('saved', this.saved);
    },
    matchScrollPosition: function() {
      return this.setState({
        scrollTop: this.scrollbar().scrollTop()
      });
    },
    resizeStarted: function(_arg) {
      var pageX;
      pageX = _arg.pageX;
      this.setState({
        dragging: true,
        initialPageX: pageX,
        initialWidth: this.state.width
      });
      $(document).on('mousemove', this.onResizeMouseMove);
      return $(document).on('mouseup', this.resizeStopped);
    },
    resizeStopped: function(e) {
      $(document).off('mousemove', this.onResizeMouseMove);
      $(document).off('mouseup', this.resizeStopped);
      this.setState({
        dragging: false
      });
      e.stopPropagation();
      return e.preventDefault();
    },
    onResizeMouseMove: function(e) {
      if (!(this.state.dragging && e.which === 1)) {
        return this.resizeStopped();
      }
      this.setState({
        width: this.state.initialWidth + e.pageX - this.state.initialPageX
      });
      e.stopPropagation();
      return e.preventDefault();
    }
  });

  module.exports = BlameListView;

}).call(this);
