# path = require 'path'
# fs = require 'fs'
# { inspect } = require 'util'
# { WorkspaceView, Range } = require 'atom'
#
#
# openFile = (filename) ->
#   atom.workspaceView = new WorkspaceView
#   atom.project.setPath path.join __dirname, 'fixtures'
#   atom.workspaceView.openSync filename
#   atom.workspaceView.attachToDom()
#   editorView = atom.workspaceView.getActiveView()
#   editor = editorView.getEditor()
#   { editorView, editor }
#
# loadLanguage = ->
#   languageCoffeeScriptPath = atom.packages.resolvePackagePath 'language-javascript'
#   grammarDir = path.resolve languageCoffeeScriptPath, 'grammars'
#   for filename in fs.readdirSync grammarDir
#     atom.syntax.loadGrammarSync path.resolve grammarDir, filename
#
# activatePackage = (callback) ->
#   [ activationPromise, watcher ] = []
#   atom.packages.activatePackage 'refactor'
#   .then ({ mainModule }) ->
#     watcher = mainModule.watchers[0]
#     activationPromise = atom.packages.activatePackage 'js-refactor'
#     .then ->
#       callback activationPromise, watcher
#
# describe "main", ->
#
#   describe "when '.js' file is opened", ->
#
#     [ editorView, editor, activationPromise, watcher, errorView, referenceView ] = []
#
#     beforeEach ->
#       { editorView, editor } = openFile 'fibonacci.js'
#       editor.setCursorBufferPosition [0, 4]
#       loadLanguage()
#       activatePackage (p, w) ->
#         activationPromise = p
#         watcher = w
#
#     it "attaches the views", ->
#       waitsForPromise ->
#         activationPromise
#       runs ->
#         errorView = atom.workspaceView.find ".refactor-error"
#         referenceView = atom.workspaceView.find ".refactor-reference"
#         expect(errorView).toExist()
#         expect(referenceView).toExist()
#
#     it "activates watcher", ->
#       waitsForPromise ->
#         activationPromise
#       runs ->
#         expect(watcher.ripper).toBeDefined()
#
#     it "starts highlighting", ->
#       waitsForPromise ->
#         activationPromise
#       runs ->
#         expect(referenceView.find('.marker').length).toEqual 5
#
#     it "has single cursor", ->
#       waitsForPromise ->
#         activationPromise
#       runs ->
#         expect(editor.getCursors().length).toEqual 1
#
#     describe "when 'js-refactor:rename' event is triggered", ->
#
#       it "has multi-cursors", ->
#         atom.workspaceView.trigger 'refactor:rename'
#         waitsForPromise ->
#           activationPromise
#         runs ->
#           expect(editor.getCursors().length).toEqual 5
#
#     describe "when 'js-refactor:done' event is triggered", ->
#
#       it "has single cursor", ->
#         atom.workspaceView.trigger 'refactor:done'
#         waitsForPromise ->
#           activationPromise
#         runs ->
#           expect(editor.getCursors().length).toEqual 1
