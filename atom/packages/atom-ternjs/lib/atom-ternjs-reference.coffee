ReferenceView = require './atom-ternjs-reference-view'
_ = require 'underscore-plus'
fs = require 'fs'
path = require 'path'
{TextBuffer} = require 'atom'

module.exports =
class Reference

  reference: null
  manager: null
  references: []

  constructor: (manager, state = {}) ->
    @manager = manager

    @reference = new ReferenceView()
    @reference.initialize(this)
    @referencePanel = atom.workspace.addBottomPanel(item: @reference, priority: 0)
    @referencePanel.hide()

    atom.views.getView(@referencePanel).classList.add('atom-ternjs-reference-panel', 'panel-bottom')

    @registerEvents()

  registerEvents: ->
    close = @reference.getClose()
    close.addEventListener('click', (e) =>
      @hide()
      editor = atom.workspace.getActiveTextEditor()
      return unless editor
      view = atom.views.getView(editor)
      view?.focus?()
    )

  goToReference: (idx) ->
    editor = atom.workspace.getActiveTextEditor()
    return unless editor
    ref = @references.refs[idx]
    @manager.helper.openFileAndGoTo(ref.start, ref.file)

  findReference: ->
    return unless @manager.client
    editor = atom.workspace.getActiveTextEditor()
    return unless editor
    cursor = editor.getLastCursor()
    position = cursor.getBufferPosition()
    @manager.client.refs(editor.getURI(), {line: position.row, ch: position.column}).then (data) =>
      @references = data
      for ref in data.refs
        ref.file = ref.file.replace(/^.\//, '')
        ref.file = path.resolve(atom.project.relativizePath(@manager.server.rootPath)[0], ref.file)
      data.refs = _.uniq(data.refs, (item) =>
        JSON.stringify item
      )

      data = @gatherMeta(data)
      @referencePanel.show()
      @reference.buildItems(data)

  gatherMeta: (data) ->
    for item, i in data.refs
      content = fs.readFileSync(item.file, 'utf8')
      buffer = new TextBuffer({ text: content })
      item.position = buffer.positionForCharacterIndex(item.start)
      item.lineText = buffer.lineForRow(item.position.row)
      item.lineText = item.lineText.replace(data.name, "<strong>#{data.name}</strong>")
      buffer.destroy()
    data

  hide: ->
    @referencePanel.hide()

  show: ->
    @referencePanel.show()

  destroy: ->
    @reference?.destroy()
    @reference = null

    @referencePanel?.destroy()
    @referencePanel = null
