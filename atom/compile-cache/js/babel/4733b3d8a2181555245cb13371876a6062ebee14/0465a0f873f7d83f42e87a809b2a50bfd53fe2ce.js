Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _eventKit = require('event-kit');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _reactDomPragma = require('react-dom-pragma');

var _reactDomPragma2 = _interopRequireDefault(_reactDomPragma);

var _lazyReq = require('lazy-req');

var _lazyReq2 = _interopRequireDefault(_lazyReq);

'use babel';

var lazyReq = (0, _lazyReq2['default'])(require);
var lodash = lazyReq('lodash');
var jshint = lazyReq('jshint');
var jsxhint = lazyReq('jshint-jsx');
var cli = lazyReq('jshint/src/cli');
var loadConfig = lazyReq('./load-config');
var plugin = {};
var markersByEditorId = {};
var errorsByEditorId = {};
var subscriptionTooltips = new _eventKit.CompositeDisposable();
var _ = undefined;

var SUPPORTED_GRAMMARS = ['source.js', 'source.jsx', 'source.js.jsx'];

var jsHintStatusBar = document.createElement('span');
jsHintStatusBar.setAttribute('id', 'jshint-statusbar');
jsHintStatusBar.classList.add('inline-block');

var updateStatusText = function updateStatusText(line, character, reason) {
	jsHintStatusBar.textContent = line && character && reason ? 'JSHint ' + line + ':' + character + ' ' + reason : '';
};

var getMarkersForEditor = function getMarkersForEditor() {
	var editor = atom.workspace.getActiveTextEditor();

	if (editor && markersByEditorId[editor.id]) {
		return markersByEditorId[editor.id];
	}

	return {};
};

var getErrorsForEditor = function getErrorsForEditor() {
	var editor = atom.workspace.getActiveTextEditor();

	if (editor && errorsByEditorId[editor.id]) {
		return errorsByEditorId[editor.id];
	}

	return [];
};

var destroyMarkerAtRow = function destroyMarkerAtRow(row) {
	var editor = atom.workspace.getActiveTextEditor();

	if (markersByEditorId[editor.id] && markersByEditorId[editor.id][row]) {
		markersByEditorId[editor.id][row].destroy();
		delete markersByEditorId[editor.id][row];
	}
};

var getRowForError = function getRowForError(error) {
	// JSHint reports `line: 0` when config error
	var line = error[0].line || 1;

	var row = line - 1;

	return row;
};

var clearOldMarkers = function clearOldMarkers(errors) {
	subscriptionTooltips.dispose();

	var rows = _.map(errors, function (error) {
		return getRowForError(error);
	});

	var oldMarkers = getMarkersForEditor();
	_.each(_.keys(oldMarkers), function (row) {
		if (!_.contains(rows, row)) {
			destroyMarkerAtRow(row);
		}
	});
};

var saveMarker = function saveMarker(marker, row) {
	var editor = atom.workspace.getActiveTextEditor();

	if (!markersByEditorId[editor.id]) {
		markersByEditorId[editor.id] = {};
	}

	markersByEditorId[editor.id][row] = marker;
};

var getMarkerAtRow = function getMarkerAtRow(row) {
	var editor = atom.workspace.getActiveTextEditor();

	if (!markersByEditorId[editor.id]) {
		return null;
	}

	return markersByEditorId[editor.id][row];
};

var updateStatusbar = function updateStatusbar() {
	var statusBar = atom.views.getView(atom.workspace).querySelector('.status-bar');

	if (!statusBar) {
		return;
	}

	if (!jsHintStatusBar.parentNode) {
		statusBar.addLeftTile({ item: jsHintStatusBar });
	}

	var editor = atom.workspace.getActiveTextEditor();

	if (!editor || !errorsByEditorId[editor.id]) {
		updateStatusText();
		return;
	}

	var line = editor.getCursorBufferPosition().row + 1;
	var error = errorsByEditorId[editor.id][line] || _.first(_.compact(errorsByEditorId[editor.id]));
	error = error[0];

	updateStatusText(error.line, error.character, error.reason);
};

var getReasonsForError = function getReasonsForError(error) {
	return _.map(error, function (el) {
		return el.character + ': ' + el.reason;
	});
};

var addReasons = function addReasons(marker, error) {
	var row = getRowForError(error);
	var editorElement = atom.views.getView(atom.workspace.getActiveTextEditor());
	var reasons = '<div class="jshint-errors">' + getReasonsForError(error).join('<br>') + '</div>';
	var target = editorElement.shadowRoot.querySelectorAll('.jshint-line-number.line-number-' + row);
	var tooltip = atom.tooltips.add(target, {
		title: reasons,
		placement: 'bottom',
		delay: { show: 200 }
	});

	subscriptionTooltips.add(tooltip);
};

var displayError = function displayError(err) {
	var row = getRowForError(err);

	if (getMarkerAtRow(row)) {
		return;
	}

	var editor = atom.workspace.getActiveTextEditor();
	var marker = editor.markBufferRange([[row, 0], [row, 1]]);
	editor.decorateMarker(marker, { type: 'line', 'class': 'jshint-line' });
	editor.decorateMarker(marker, { type: 'line-number', 'class': 'jshint-line-number' });
	saveMarker(marker, row);
	addReasons(marker, err);
};

var displayErrors = function displayErrors() {
	var errors = _.compact(getErrorsForEditor());
	clearOldMarkers(errors);
	updateStatusbar();
	_.each(errors, displayError);
};

var removeMarkersForEditorId = function removeMarkersForEditorId(id) {
	if (markersByEditorId[id]) {
		delete markersByEditorId[id];
	}
};

var removeErrorsForEditorId = function removeErrorsForEditorId(id) {
	if (errorsByEditorId[id]) {
		delete errorsByEditorId[id];
	}
};

var lint = function lint() {
	var editor = atom.workspace.getActiveTextEditor();

	if (!editor) {
		return;
	}

	if (SUPPORTED_GRAMMARS.indexOf(editor.getGrammar().scopeName) === -1) {
		return;
	}

	var file = editor.getURI();

	// Hack to make JSHint look for .jshintignore in the correct dir
	// Because JSHint doesn't use its `cwd` option
	process.chdir(_path2['default'].dirname(file));

	// Remove errors and don't lint if file is ignored in .jshintignore
	if (file && cli().gather({ args: [file] }).length === 0) {
		removeErrorsForEditorId(editor.id);
		displayErrors();
		removeMarkersForEditorId(editor.id);
		return;
	}

	var config = file ? loadConfig()(file) : {};
	var linter = atom.config.get('jshint.supportLintingJsx') || atom.config.get('jshint.transformJsx') ? jsxhint().JSXHINT : jshint().JSHINT;

	if (Object.keys(config).length === 0 && atom.config.get('jshint.onlyConfig')) {
		return;
	}

	var origCode = editor.getText();
	var grammarScope = editor.getGrammar().scopeName;
	var isJsx = grammarScope === 'source.jsx' || grammarScope === 'source.js.jsx';
	var code = isJsx ? (0, _reactDomPragma2['default'])(origCode) : origCode;
	var pragmaWasAdded = code !== origCode;

	try {
		linter(code, config, config.globals);
	} catch (err) {}

	removeErrorsForEditorId(editor.id);

	// workaround the errors array sometimes containing `null`
	var errors = _.compact(linter.errors);

	if (errors.length > 0) {
		(function () {
			// aggregate same-line errors
			var ret = [];
			_.each(errors, function (el) {
				if (pragmaWasAdded) {
					el.line--;
				}

				var l = el.line;

				if (Array.isArray(ret[l])) {
					ret[l].push(el);

					ret[l] = _.sortBy(ret[l], function (el) {
						return el.character;
					});
				} else {
					ret[l] = [el];
				}
			});

			errorsByEditorId[editor.id] = ret;
		})();
	}

	displayErrors();
};

var debouncedLint = null;
var debouncedDisplayErrors = null;
var debouncedUpdateStatusbar = null;

var registerEvents = function registerEvents() {
	lint();
	var workspaceElement = atom.views.getView(atom.workspace);

	debouncedLint = debouncedLint || _.debounce(lint, 50);
	debouncedDisplayErrors = debouncedDisplayErrors || _.debounce(displayErrors, 200);
	debouncedUpdateStatusbar = debouncedUpdateStatusbar || _.debounce(updateStatusbar, 100);

	atom.workspace.observeTextEditors(function (editor) {
		var buffer = editor.getBuffer();

		editor.emitter.off('scroll-top-changed', debouncedDisplayErrors);
		editor.emitter.off('did-change-cursor-position', debouncedUpdateStatusbar);
		buffer.emitter.off('did-save did-change-modified', debouncedLint);

		if (!atom.config.get('jshint.validateOnlyOnSave')) {
			buffer.onDidChangeModified(debouncedLint);
		}

		buffer.onDidSave(debouncedLint);

		editor.onDidChangeScrollTop(debouncedDisplayErrors);
		editor.onDidChangeCursorPosition(debouncedUpdateStatusbar);
	});

	workspaceElement.addEventListener('editor:will-be-removed', function (e, editorView) {
		if (editorView && editorView.editor) {
			removeErrorsForEditorId(editorView.editor.id);
			removeMarkersForEditorId(editorView.editor.id);
		}
	});
};

var config = plugin.config = {
	onlyConfig: {
		type: 'boolean',
		'default': false,
		description: 'Disable linter if there is no config file found for the linter.'
	},
	validateOnlyOnSave: {
		type: 'boolean',
		'default': false
	},
	supportLintingJsx: {
		type: 'boolean',
		'default': false,
		title: 'Support Linting JSX'
	}
};

exports.config = config;
var activate = plugin.activate = function () {
	_ = lodash();
	registerEvents();
	atom.config.observe('jshint.onlyConfig', registerEvents);
	atom.config.observe('jshint.validateOnlyOnSave', registerEvents);
	atom.commands.add('atom-workspace', 'jshint:lint', lint);
};

exports.activate = activate;
exports['default'] = plugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FuZHJlaS9kb3RmaWxlcy9hdG9tL3BhY2thZ2VzL2pzaGludC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7d0JBQ2tDLFdBQVc7O29CQUM1QixNQUFNOzs7OzhCQUNJLGtCQUFrQjs7Ozt1QkFDckIsVUFBVTs7OztBQUpsQyxXQUFXLENBQUM7O0FBTVosSUFBTSxPQUFPLEdBQUcsMEJBQVksT0FBTyxDQUFDLENBQUM7QUFDckMsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2pDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqQyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdEMsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDdEMsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzVDLElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNsQixJQUFNLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUM3QixJQUFNLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztBQUM1QixJQUFNLG9CQUFvQixHQUFHLG1DQUF5QixDQUFDO0FBQ3ZELElBQUksQ0FBQyxZQUFBLENBQUM7O0FBRU4sSUFBTSxrQkFBa0IsR0FBRyxDQUMxQixXQUFXLEVBQ1gsWUFBWSxFQUNaLGVBQWUsQ0FDZixDQUFDOztBQUVGLElBQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdkQsZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUN2RCxlQUFlLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFOUMsSUFBTSxnQkFBZ0IsR0FBRyxTQUFuQixnQkFBZ0IsQ0FBSSxJQUFJLEVBQUUsU0FBUyxFQUFF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QUFFSyxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHO0FBQ3JDLFdBQVUsRUFBRTtBQUNYLE1BQUksRUFBRSxTQUFTO0FBQ2YsYUFBUyxLQUFLO0FBQ2QsYUFBVyxFQUFFLGlFQUFpRTtFQUM5RTtBQUNELG1CQUFrQixFQUFFO0FBQ25CLE1BQUksRUFBRSxTQUFTO0FBQ2YsYUFBUyxLQUFLO0VBQ2Q7QUFDRCxrQkFBaUIsRUFBRTtBQUNsQixNQUFJLEVBQUUsU0FBUztBQUNmLGFBQVMsS0FBSztBQUNkLE9BQUssRUFBRSxxQkFBcUI7RUFDNUI7Q0FDRCxDQUFDOzs7QUFFSyxJQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxHQUFHLFlBQU07QUFDL0MsRUFBQyxHQUFHLE1BQU0sRUFBRSxDQUFDO0FBQ2IsZUFBYyxFQUFFLENBQUM7QUFDakIsS0FBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDekQsS0FBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsMkJBQTJCLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDakUsS0FBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO0NBQ3pELENBQUM7OztxQkFFYSxNQUFNIiwiZmlsZSI6Ii9ob21lL2FuZHJlaS9kb3RmaWxlcy9hdG9tL3BhY2thZ2VzL2pzaGludC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgcmVhY3REb21QcmFnbWEgZnJvbSAncmVhY3QtZG9tLXByYWdtYSc7XG5pbXBvcnQgbGF6eVJlcXVpcmUgZnJvbSAnbGF6eS1yZXEnO1xuXG5jb25zdCBsYXp5UmVxID0gbGF6eVJlcXVpcmUocmVxdWlyZSk7XG5jb25zdCBsb2Rhc2ggPSBsYXp5UmVxKCdsb2Rhc2gnKTtcbmNvbnN0IGpzaGludCA9IGxhenlSZXEoJ2pzaGludCcpO1xuY29uc3QganN4aGludCA9IGxhenlSZXEoJ2pzaGludC1qc3gnKTtcbmNvbnN0IGNsaSA9IGxhenlSZXEoJ2pzaGludC9zcmMvY2xpJyk7XG5jb25zdCBsb2FkQ29uZmlnID0gbGF6eVJlcSgnLi9sb2FkLWNvbmZpZycpO1xuY29uc3QgcGx1Z2luID0ge307XG5jb25zdCBtYXJrZXJzQnlFZGl0b3JJZCA9IHt9O1xuY29uc3QgZXJyb3JzQnlFZGl0b3JJZCA9IHt9O1xuY29uc3Qgc3Vic2NyaXB0aW9uVG9vbHRpcHMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xubGV0IF87XG5cbmNvbnN0IFNVUFBPUlRFRF9HUkFNTUFSUyA9IFtcblx0J3NvdXJjZS5qcycsXG5cdCdzb3VyY2UuanN4Jyxcblx0J3NvdXJjZS5qcy5qc3gnXG5dO1xuXG5jb25zdCBqc0hpbnRTdGF0dXNCYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5qc0hpbnRTdGF0dXNCYXIuc2V0QXR0cmlidXRlKCdpZCcsICdqc2hpbnQtc3RhdHVzYmFyJyk7XG5qc0hpbnRTdGF0dXNCYXIuY2xhc3NMaXN0LmFkZCgnaW5saW5lLWJsb2NrJyk7XG5cbmNvbnN0IHVwZGF0ZVN0YXR1c1RleHQgPSAobGluZSwgY2hhcmFjdGVyLCByZWFzb24pID0+IHtcblx0anNIaW50U3RhdHVzQmFyLnRleHRDb250ZW50ID0gbGluZSAmJiBjaGFyYWN0ZXIgJiYgcmVhc29uID8gYEpTSGludCAke2xpbmV9OiR7Y2hhcmFjdGVyfSAke3JlYXNvbn1gIDogJyc7XG59O1xuXG5jb25zdCBnZXRNYXJrZXJzRm9yRWRpdG9yID0gKCkgPT4ge1xuXHRjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cblx0aWYgKGVkaXRvciAmJiBtYXJrZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdKSB7XG5cdFx0cmV0dXJuIG1hcmtlcnNCeUVkaXRvcklkW2VkaXRvci5pZF07XG5cdH1cblxuXHRyZXR1cm4ge307XG59O1xuXG5jb25zdCBnZXRFcnJvcnNGb3JFZGl0b3IgPSAoKSA9PiB7XG5cdGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblxuXHRpZiAoZWRpdG9yICYmIGVycm9yc0J5RWRpdG9ySWRbZWRpdG9yLmlkXSkge1xuXHRcdHJldHVybiBlcnJvcnNCeUVkaXRvcklkW2VkaXRvci5pZF07XG5cdH1cblxuXHRyZXR1cm4gW107XG59O1xuXG5jb25zdCBkZXN0cm95TWFya2VyQXRSb3cgPSByb3cgPT4ge1xuXHRjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cblx0aWYgKG1hcmtlcnNCeUVkaXRvcklkW2VkaXRvci5pZF0gJiYgbWFya2Vyc0J5RWRpdG9ySWRbZWRpdG9yLmlkXVtyb3ddKSB7XG5cdFx0bWFya2Vyc0J5RWRpdG9ySWRbZWRpdG9yLmlkXVtyb3ddLmRlc3Ryb3koKTtcblx0XHRkZWxldGUgbWFya2Vyc0J5RWRpdG9ySWRbZWRpdG9yLmlkXVtyb3ddO1xuXHR9XG59O1xuXG5jb25zdCBnZXRSb3dGb3JFcnJvciA9IGVycm9yID0+IHtcblx0Ly8gSlNIaW50IHJlcG9ydHMgYGxpbmU6IDBgIHdoZW4gY29uZmlnIGVycm9yXG5cdGNvbnN0IGxpbmUgPSBlcnJvclswXS5saW5lIHx8IDE7XG5cblx0Y29uc3Qgcm93ID0gbGluZSAtIDE7XG5cblx0cmV0dXJuIHJvdztcbn07XG5cbmNvbnN0IGNsZWFyT2xkTWFya2VycyA9IGVycm9ycyA9PiB7XG5cdHN1YnNjcmlwdGlvblRvb2x0aXBzLmRpc3Bvc2UoKTtcblxuXHRjb25zdCByb3dzID0gXy5tYXAoZXJyb3JzLCBlcnJvciA9PiBnZXRSb3dGb3JFcnJvcihlcnJvcikpO1xuXG5cdGNvbnN0IG9sZE1hcmtlcnMgPSBnZXRNYXJrZXJzRm9yRWRpdG9yKCk7XG5cdF8uZWFjaChfLmtleXMob2xkTWFya2VycyksIHJvdyA9PiB7XG5cdFx0aWYgKCFfLmNvbnRhaW5zKHJvd3MsIHJvdykpIHtcblx0XHRcdGRlc3Ryb3lNYXJrZXJBdFJvdyhyb3cpO1xuXHRcdH1cblx0fSk7XG59O1xuXG5jb25zdCBzYXZlTWFya2VyID0gKG1hcmtlciwgcm93KSA9PiB7XG5cdGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblxuXHRpZiAoIW1hcmtlcnNCeUVkaXRvcklkW2VkaXRvci5pZF0pIHtcblx0XHRtYXJrZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdID0ge307XG5cdH1cblxuXHRtYXJrZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdW3Jvd10gPSBtYXJrZXI7XG59O1xuXG5jb25zdCBnZXRNYXJrZXJBdFJvdyA9IHJvdyA9PiB7XG5cdGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblxuXHRpZiAoIW1hcmtlcnNCeUVkaXRvcklkW2VkaXRvci5pZF0pIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHJldHVybiBtYXJrZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdW3Jvd107XG59O1xuXG5jb25zdCB1cGRhdGVTdGF0dXNiYXIgPSAoKSA9PiB7XG5cdGNvbnN0IHN0YXR1c0JhciA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSkucXVlcnlTZWxlY3RvcignLnN0YXR1cy1iYXInKTtcblxuXHRpZiAoIXN0YXR1c0Jhcikge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGlmICghanNIaW50U3RhdHVzQmFyLnBhcmVudE5vZGUpIHtcblx0XHRzdGF0dXNCYXIuYWRkTGVmdFRpbGUoe2l0ZW06IGpzSGludFN0YXR1c0Jhcn0pO1xuXHR9XG5cblx0Y29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuXG5cdGlmICghZWRpdG9yIHx8ICFlcnJvcnNCeUVkaXRvcklkW2VkaXRvci5pZF0pIHtcblx0XHR1cGRhdGVTdGF0dXNUZXh0KCk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3QgbGluZSA9IGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpLnJvdyArIDE7XG5cdGxldCBlcnJvciA9IGVycm9yc0J5RWRpdG9ySWRbZWRpdG9yLmlkXVtsaW5lXSB8fCBfLmZpcnN0KF8uY29tcGFjdChlcnJvcnNCeUVkaXRvcklkW2VkaXRvci5pZF0pKTtcblx0ZXJyb3IgPSBlcnJvclswXTtcblxuXHR1cGRhdGVTdGF0dXNUZXh0KGVycm9yLmxpbmUsIGVycm9yLmNoYXJhY3RlciwgZXJyb3IucmVhc29uKTtcbn07XG5cbmNvbnN0IGdldFJlYXNvbnNGb3JFcnJvciA9IGVycm9yID0+IHtcblx0cmV0dXJuIF8ubWFwKGVycm9yLCBlbCA9PiBgJHtlbC5jaGFyYWN0ZXJ9OiAke2VsLnJlYXNvbn1gKTtcbn07XG5cbmNvbnN0IGFkZFJlYXNvbnMgPSAobWFya2VyLCBlcnJvcikgPT4ge1xuXHRjb25zdCByb3cgPSBnZXRSb3dGb3JFcnJvcihlcnJvcik7XG5cdGNvbnN0IGVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKTtcblx0Y29uc3QgcmVhc29ucyA9IGA8ZGl2IGNsYXNzPVwianNoaW50LWVycm9yc1wiPiR7Z2V0UmVhc29uc0ZvckVycm9yKGVycm9yKS5qb2luKCc8YnI+Jyl9PC9kaXY+YDtcblx0Y29uc3QgdGFyZ2V0ID0gZWRpdG9yRWxlbWVudC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3JBbGwoYC5qc2hpbnQtbGluZS1udW1iZXIubGluZS1udW1iZXItJHtyb3d9YCk7XG5cdGNvbnN0IHRvb2x0aXAgPSBhdG9tLnRvb2x0aXBzLmFkZCh0YXJnZXQsIHtcblx0XHR0aXRsZTogcmVhc29ucyxcblx0XHRwbGFjZW1lbnQ6ICdib3R0b20nLFxuXHRcdGRlbGF5OiB7c2hvdzogMjAwfVxuXHR9KTtcblxuXHRzdWJzY3JpcHRpb25Ub29sdGlwcy5hZGQodG9vbHRpcCk7XG59O1xuXG5jb25zdCBkaXNwbGF5RXJyb3IgPSBlcnIgPT4ge1xuXHRjb25zdCByb3cgPSBnZXRSb3dGb3JFcnJvcihlcnIpO1xuXG5cdGlmIChnZXRNYXJrZXJBdFJvdyhyb3cpKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuXHRjb25zdCBtYXJrZXIgPSBlZGl0b3IubWFya0J1ZmZlclJhbmdlKFtbcm93LCAwXSwgW3JvdywgMV1dKTtcblx0ZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge3R5cGU6ICdsaW5lJywgY2xhc3M6ICdqc2hpbnQtbGluZSd9KTtcblx0ZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge3R5cGU6ICdsaW5lLW51bWJlcicsIGNsYXNzOiAnanNoaW50LWxpbmUtbnVtYmVyJ30pO1xuXHRzYXZlTWFya2VyKG1hcmtlciwgcm93KTtcblx0YWRkUmVhc29ucyhtYXJrZXIsIGVycik7XG59O1xuXG5jb25zdCBkaXNwbGF5RXJyb3JzID0gKCkgPT4ge1xuXHRjb25zdCBlcnJvcnMgPSBfLmNvbXBhY3QoZ2V0RXJyb3JzRm9yRWRpdG9yKCkpO1xuXHRjbGVhck9sZE1hcmtlcnMoZXJyb3JzKTtcblx0dXBkYXRlU3RhdHVzYmFyKCk7XG5cdF8uZWFjaChlcnJvcnMsIGRpc3BsYXlFcnJvcik7XG59O1xuXG5jb25zdCByZW1vdmVNYXJrZXJzRm9yRWRpdG9ySWQgPSBpZCA9PiB7XG5cdGlmIChtYXJrZXJzQnlFZGl0b3JJZFtpZF0pIHtcblx0XHRkZWxldGUgbWFya2Vyc0J5RWRpdG9ySWRbaWRdO1xuXHR9XG59O1xuXG5jb25zdCByZW1vdmVFcnJvcnNGb3JFZGl0b3JJZCA9IGlkID0+IHtcblx0aWYgKGVycm9yc0J5RWRpdG9ySWRbaWRdKSB7XG5cdFx0ZGVsZXRlIGVycm9yc0J5RWRpdG9ySWRbaWRdO1xuXHR9XG59O1xuXG5jb25zdCBsaW50ID0gKCkgPT4ge1xuXHRjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cblx0aWYgKCFlZGl0b3IpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRpZiAoU1VQUE9SVEVEX0dSQU1NQVJTLmluZGV4T2YoZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUpID09PSAtMSkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IGZpbGUgPSBlZGl0b3IuZ2V0VVJJKCk7XG5cblx0Ly8gSGFjayB0byBtYWtlIEpTSGludCBsb29rIGZvciAuanNoaW50aWdub3JlIGluIHRoZSBjb3JyZWN0IGRpclxuXHQvLyBCZWNhdXNlIEpTSGludCBkb2Vzbid0IHVzZSBpdHMgYGN3ZGAgb3B0aW9uXG5cdHByb2Nlc3MuY2hkaXIocGF0aC5kaXJuYW1lKGZpbGUpKTtcblxuXHQvLyBSZW1vdmUgZXJyb3JzIGFuZCBkb24ndCBsaW50IGlmIGZpbGUgaXMgaWdub3JlZCBpbiAuanNoaW50aWdub3JlXG5cdGlmIChmaWxlICYmIGNsaSgpLmdhdGhlcih7YXJnczogW2ZpbGVdfSkubGVuZ3RoID09PSAwKSB7XG5cdFx0cmVtb3ZlRXJyb3JzRm9yRWRpdG9ySWQoZWRpdG9yLmlkKTtcblx0XHRkaXNwbGF5RXJyb3JzKCk7XG5cdFx0cmVtb3ZlTWFya2Vyc0ZvckVkaXRvcklkKGVkaXRvci5pZCk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3QgY29uZmlnID0gZmlsZSA/IGxvYWRDb25maWcoKShmaWxlKSA6IHt9O1xuXHRjb25zdCBsaW50ZXIgPSAoYXRvbS5jb25maWcuZ2V0KCdqc2hpbnQuc3VwcG9ydExpbnRpbmdKc3gnKSB8fCBhdG9tLmNvbmZpZy5nZXQoJ2pzaGludC50cmFuc2Zvcm1Kc3gnKSkgPyBqc3hoaW50KCkuSlNYSElOVCA6IGpzaGludCgpLkpTSElOVDtcblxuXHRpZiAoT2JqZWN0LmtleXMoY29uZmlnKS5sZW5ndGggPT09IDAgJiYgYXRvbS5jb25maWcuZ2V0KCdqc2hpbnQub25seUNvbmZpZycpKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3Qgb3JpZ0NvZGUgPSBlZGl0b3IuZ2V0VGV4dCgpO1xuXHRjb25zdCBncmFtbWFyU2NvcGUgPSBlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZTtcblx0Y29uc3QgaXNKc3ggPSBncmFtbWFyU2NvcGUgPT09ICdzb3VyY2UuanN4JyB8fCBncmFtbWFyU2NvcGUgPT09ICdzb3VyY2UuanMuanN4Jztcblx0Y29uc3QgY29kZSA9IGlzSnN4ID8gcmVhY3REb21QcmFnbWEob3JpZ0NvZGUpIDogb3JpZ0NvZGU7XG5cdGNvbnN0IHByYWdtYVdhc0FkZGVkID0gY29kZSAhPT0gb3JpZ0NvZGU7XG5cblx0dHJ5IHtcblx0XHRsaW50ZXIoY29kZSwgY29uZmlnLCBjb25maWcuZ2xvYmFscyk7XG5cdH0gY2F0Y2ggKGVycikge31cblxuXHRyZW1vdmVFcnJvcnNGb3JFZGl0b3JJZChlZGl0b3IuaWQpO1xuXG5cdC8vIHdvcmthcm91bmQgdGhlIGVycm9ycyBhcnJheSBzb21ldGltZXMgY29udGFpbmluZyBgbnVsbGBcblx0Y29uc3QgZXJyb3JzID0gXy5jb21wYWN0KGxpbnRlci5lcnJvcnMpO1xuXG5cdGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuXHRcdC8vIGFnZ3JlZ2F0ZSBzYW1lLWxpbmUgZXJyb3JzXG5cdFx0Y29uc3QgcmV0ID0gW107XG5cdFx0Xy5lYWNoKGVycm9ycywgZWwgPT4ge1xuXHRcdFx0aWYgKHByYWdtYVdhc0FkZGVkKSB7XG5cdFx0XHRcdGVsLmxpbmUtLTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgbCA9IGVsLmxpbmU7XG5cblx0XHRcdGlmIChBcnJheS5pc0FycmF5KHJldFtsXSkpIHtcblx0XHRcdFx0cmV0W2xdLnB1c2goZWwpO1xuXG5cdFx0XHRcdHJldFtsXSA9IF8uc29ydEJ5KHJldFtsXSwgZWwgPT4gZWwuY2hhcmFjdGVyKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldFtsXSA9IFtlbF07XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRlcnJvcnNCeUVkaXRvcklkW2VkaXRvci5pZF0gPSByZXQ7XG5cdH1cblxuXHRkaXNwbGF5RXJyb3JzKCk7XG59O1xuXG5sZXQgZGVib3VuY2VkTGludCA9IG51bGw7XG5sZXQgZGVib3VuY2VkRGlzcGxheUVycm9ycyA9IG51bGw7XG5sZXQgZGVib3VuY2VkVXBkYXRlU3RhdHVzYmFyID0gbnVsbDtcblxuY29uc3QgcmVnaXN0ZXJFdmVudHMgPSAoKSA9PiB7XG5cdGxpbnQoKTtcblx0Y29uc3Qgd29ya3NwYWNlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSk7XG5cblx0ZGVib3VuY2VkTGludCA9IGRlYm91bmNlZExpbnQgfHwgXy5kZWJvdW5jZShsaW50LCA1MCk7XG5cdGRlYm91bmNlZERpc3BsYXlFcnJvcnMgPSBkZWJvdW5jZWREaXNwbGF5RXJyb3JzIHx8IF8uZGVib3VuY2UoZGlzcGxheUVycm9ycywgMjAwKTtcblx0ZGVib3VuY2VkVXBkYXRlU3RhdHVzYmFyID0gZGVib3VuY2VkVXBkYXRlU3RhdHVzYmFyIHx8IF8uZGVib3VuY2UodXBkYXRlU3RhdHVzYmFyLCAxMDApO1xuXG5cdGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyhlZGl0b3IgPT4ge1xuXHRcdGNvbnN0IGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKTtcblxuXHRcdGVkaXRvci5lbWl0dGVyLm9mZignc2Nyb2xsLXRvcC1jaGFuZ2VkJywgZGVib3VuY2VkRGlzcGxheUVycm9ycyk7XG5cdFx0ZWRpdG9yLmVtaXR0ZXIub2ZmKCdkaWQtY2hhbmdlLWN1cnNvci1wb3NpdGlvbicsIGRlYm91bmNlZFVwZGF0ZVN0YXR1c2Jhcik7XG5cdFx0YnVmZmVyLmVtaXR0ZXIub2ZmKCdkaWQtc2F2ZSBkaWQtY2hhbmdlLW1vZGlmaWVkJywgZGVib3VuY2VkTGludCk7XG5cblx0XHRpZiAoIWF0b20uY29uZmlnLmdldCgnanNoaW50LnZhbGlkYXRlT25seU9uU2F2ZScpKSB7XG5cdFx0XHRidWZmZXIub25EaWRDaGFuZ2VNb2RpZmllZChkZWJvdW5jZWRMaW50KTtcblx0XHR9XG5cblx0XHRidWZmZXIub25EaWRTYXZlKGRlYm91bmNlZExpbnQpO1xuXG5cdFx0ZWRpdG9yLm9uRGlkQ2hhbmdlU2Nyb2xsVG9wKGRlYm91bmNlZERpc3BsYXlFcnJvcnMpO1xuXHRcdGVkaXRvci5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uKGRlYm91bmNlZFVwZGF0ZVN0YXR1c2Jhcik7XG5cdH0pO1xuXG5cdHdvcmtzcGFjZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZWRpdG9yOndpbGwtYmUtcmVtb3ZlZCcsIChlLCBlZGl0b3JWaWV3KSA9PiB7XG5cdFx0aWYgKGVkaXRvclZpZXcgJiYgZWRpdG9yVmlldy5lZGl0b3IpIHtcblx0XHRcdHJlbW92ZUVycm9yc0ZvckVkaXRvcklkKGVkaXRvclZpZXcuZWRpdG9yLmlkKTtcblx0XHRcdHJlbW92ZU1hcmtlcnNGb3JFZGl0b3JJZChlZGl0b3JWaWV3LmVkaXRvci5pZCk7XG5cdFx0fVxuXHR9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBjb25maWcgPSBwbHVnaW4uY29uZmlnID0ge1xuXHRvbmx5Q29uZmlnOiB7XG5cdFx0dHlwZTogJ2Jvb2xlYW4nLFxuXHRcdGRlZmF1bHQ6IGZhbHNlLFxuXHRcdGRlc2NyaXB0aW9uOiAnRGlzYWJsZSBsaW50ZXIgaWYgdGhlcmUgaXMgbm8gY29uZmlnIGZpbGUgZm91bmQgZm9yIHRoZSBsaW50ZXIuJ1xuXHR9LFxuXHR2YWxpZGF0ZU9ubHlPblNhdmU6IHtcblx0XHR0eXBlOiAnYm9vbGVhbicsXG5cdFx0ZGVmYXVsdDogZmFsc2Vcblx0fSxcblx0c3VwcG9ydExpbnRpbmdKc3g6IHtcblx0XHR0eXBlOiAnYm9vbGVhbicsXG5cdFx0ZGVmYXVsdDogZmFsc2UsXG5cdFx0dGl0bGU6ICdTdXBwb3J0IExpbnRpbmcgSlNYJ1xuXHR9XG59O1xuXG5leHBvcnQgY29uc3QgYWN0aXZhdGUgPSBwbHVnaW4uYWN0aXZhdGUgPSAoKSA9PiB7XG5cdF8gPSBsb2Rhc2goKTtcblx0cmVnaXN0ZXJFdmVudHMoKTtcblx0YXRvbS5jb25maWcub2JzZXJ2ZSgnanNoaW50Lm9ubHlDb25maWcnLCByZWdpc3RlckV2ZW50cyk7XG5cdGF0b20uY29uZmlnLm9ic2VydmUoJ2pzaGludC52YWxpZGF0ZU9ubHlPblNhdmUnLCByZWdpc3RlckV2ZW50cyk7XG5cdGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdqc2hpbnQ6bGludCcsIGxpbnQpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgcGx1Z2luO1xuIl19
//# sourceURL=/home/andrei/dotfiles/atom/packages/jshint/index.js