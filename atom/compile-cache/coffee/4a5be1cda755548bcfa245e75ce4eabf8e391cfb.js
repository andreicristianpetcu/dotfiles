(function() {
  var $, BLANK_HASH, BlameLineComponent, HASH_LENGTH, RP, React, Reactionary, a, div, errorController, formatDate, getDefaultDate, moment, renderLoading, span, _defaultDate;

  $ = require('atom-space-pen-views').$;

  React = require('react-atom-fork');

  Reactionary = require('reactionary-atom-fork');

  div = Reactionary.div, span = Reactionary.span, a = Reactionary.a;

  RP = React.PropTypes;

  moment = require('moment');

  formatDate = require('../util/blameFormatter').formatDate;

  errorController = require('../controllers/errorController');

  HASH_LENGTH = 7;

  BLANK_HASH = '-'.repeat(HASH_LENGTH);

  _defaultDate = null;

  getDefaultDate = function() {
    return _defaultDate != null ? _defaultDate : _defaultDate = formatDate(moment("2014-01-01T13:37:00 Z"));
  };

  renderLoading = function() {
    return div({
      className: 'blame-line loading'
    }, span({
      className: 'hash'
    }, BLANK_HASH), span({
      className: 'date'
    }, getDefaultDate()), span({
      className: 'committer'
    }, 'Loading'));
  };

  BlameLineComponent = React.createClass({
    propTypes: {
      date: RP.string.isRequired,
      hash: RP.string.isRequired,
      remoteRevision: RP.object,
      author: RP.string.isRequired,
      committer: RP.string.isRequired,
      committerDate: RP.string.isRequired,
      summary: RP.string.isRequired,
      backgroundClass: RP.string,
      noCommit: RP.bool
    },
    render: function() {
      var url;
      if (this.props.noCommit) {
        return div({
          className: 'blame-line no-commit text-subtle'
        }, span({
          className: 'hash'
        }, BLANK_HASH), span({
          className: 'date'
        }, this.props.date), span({
          className: 'committer'
        }, 'Nobody'));
      } else {
        return div({
          className: 'blame-line ' + this.props.backgroundClass
        }, !this.props.remoteRevision ? a({
          onClick: this.didClickHashWithoutUrl,
          className: 'hash'
        }, this.props.hash.substring(0, HASH_LENGTH)) : (url = this.props.remoteRevision.url(this.props.hash), a({
          href: url,
          target: '_blank',
          className: 'hash'
        }, this.props.hash.substring(0, HASH_LENGTH))), span({
          className: 'date'
        }, this.props.date), span({
          className: 'committer text-highlight'
        }, this.props.author.split(' ').slice(-1)[0]));
      }
    },
    componentDidMount: function() {
      var $el;
      $el = $(this.getDOMNode());
      if (this.props.summary) {
        return atom.tooltips.add($el, {
          title: this.props.summary,
          placement: "auto left"
        });
      }
    },
    componentWillUnmount: function() {
      return $(this.getDOMNode()).tooltip("destroy");
    },
    shouldComponentUpdate: function(_arg) {
      var hash;
      hash = _arg.hash;
      return hash !== this.props.hash;
    },
    didClickHashWithoutUrl: function(event, element) {
      return errorController.showError('error-no-custom-url-specified');
    }
  });

  module.exports = {
    BlameLineComponent: BlameLineComponent,
    renderLoading: renderLoading
  };

}).call(this);
