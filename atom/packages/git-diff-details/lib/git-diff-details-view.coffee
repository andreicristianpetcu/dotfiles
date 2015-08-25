{View} = require 'atom-space-pen-views'
{Range, Point} = require 'atom'
Highlights = require 'highlights'
DiffDetailsDataManager = require './data-manager'
Housekeeping = require './housekeeping'

module.exports = class AtomGitDiffDetailsView extends View
  Housekeeping.includeInto(this)

  @content: ->
    @div class: "git-diff-details-outer", =>
      @div class: "git-diff-details-main-panel", outlet: "mainPanel", =>
        @div class: "editor", outlet: "contents"
      @div class: "git-diff-details-button-panel", outlet: "buttonPanel", =>
        @button class: 'btn btn-primary inline-block-tight', click: "copy", 'Copy'
        @button class: 'btn btn-error inline-block-tight', click: "undo", 'Undo'

  initialize: (@editor) ->
    @editorView = atom.views.getView(@editor)

    @initializeHousekeeping()
    @preventFocusOut()

    @highlighter = new Highlights()
    @diffDetailsDataManager = new DiffDetailsDataManager()

    @showDiffDetails = false
    @lineDiffDetails = null

    @updateCurrentRow()

  preventFocusOut: ->
    @buttonPanel.on 'mousedown', () ->
      false

    @mainPanel.on 'mousedown', () ->
      false

  getActiveTextEditor: ->
    atom.workspace.getActiveTextEditor()

  updateCurrentRow: ->
    newCurrentRow = @getActiveTextEditor()?.getCursorBufferPosition()?.row + 1
    if newCurrentRow != @currentRow
      @currentRow = newCurrentRow
      return true
    return false

  notifyContentsModified: =>
    return if @editor.isDestroyed()
    @diffDetailsDataManager.invalidate(@repositoryForPath(@editor.getPath()),
                                       @editor.getPath(),
                                       @editor.getText())
    if @showDiffDetails
      @updateDiffDetailsDisplay()

  updateDiffDetails: ->
    @diffDetailsDataManager.invalidatePreviousSelectedHunk()
    @updateCurrentRow()
    @updateDiffDetailsDisplay()

  toggleShowDiffDetails: ->
    @showDiffDetails = !@showDiffDetails
    @updateDiffDetails()

  closeDiffDetails: ->
    @showDiffDetails = false
    @updateDiffDetails()

  notifyChangeCursorPosition: ->
    if @showDiffDetails
      currentRowChanged = @updateCurrentRow()
      @updateDiffDetailsDisplay() if currentRowChanged

  copy: ->
    {selectedHunk} = @diffDetailsDataManager.getSelectedHunk(@currentRow)
    if selectedHunk?
      atom.clipboard.write(selectedHunk.oldString)
      @closeDiffDetails() if atom.config.get('git-diff-details.closeAfterCopy')

  undo: ->
    {selectedHunk} = @diffDetailsDataManager.getSelectedHunk(@currentRow)

    if selectedHunk? and buffer = @editor.getBuffer()
      if selectedHunk.kind is "m"
        buffer.deleteRows(selectedHunk.start - 1, selectedHunk.end - 1)
        buffer.insert([selectedHunk.start - 1, 0], selectedHunk.oldString)
      else
        buffer.insert([selectedHunk.start, 0], selectedHunk.oldString)
      @closeDiffDetails() unless atom.config.get('git-diff-details.keepViewToggled')

  destroyDecoration: ->
    @marker?.destroy()
    @marker = null

  attach: (position) ->
    @destroyDecoration()
    range = new Range(new Point(position - 1, 0), new Point(position - 1, 0))
    @marker = @editor.markBufferRange(range)
    @editor.decorateMarker @marker,
      type: 'overlay'
      item: this

  populate: (selectedHunk) ->
    html = @highlighter.highlightSync
      filePath: @editor.getPath()
      fileContents: selectedHunk.oldString

    html = html.replace('<pre class="editor editor-colors">', '').replace('</pre>', '')
    @contents.html(html)

  updateDiffDetailsDisplay: ->
    if @showDiffDetails
      {selectedHunk, isDifferent} = @diffDetailsDataManager.getSelectedHunk(@currentRow)

      if selectedHunk?
        return unless isDifferent
        @attach(selectedHunk.end)
        @populate(selectedHunk)
        return
      else
        @closeDiffDetails() unless atom.config.get('git-diff-details.keepViewToggled')

      @previousSelectedHunk = selectedHunk

    @destroyDecoration()
    return
