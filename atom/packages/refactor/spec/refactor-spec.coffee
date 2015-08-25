# { WorkspaceView } = require 'atom'
# Refactor = require '../lib/refactor'
#
# describe "refactor", ->
#   activationPromise = null
#
#   beforeEach ->
#     atom.workspaceView = new WorkspaceView
#     editorView = atom.workspaceView.getActiveView()
#     editor = editorView.getEditor()
#
#   describe "when the refactor:toggle event is triggered", ->
#     it "attaches and then detaches the view", ->
#       atom.workspaceView.trigger 'refactor:rename'
#       waitsForPromise ->
#         activationPromise
#       runs ->
#         console.log require('util').inspect atom.workspaceView.getActiveEditor()
