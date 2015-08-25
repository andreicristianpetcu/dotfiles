module.exports = class DiffDetailsDataManager
  constructor: ->
    @invalidate()

  liesBetween: (hunk, row) ->
    hunk.start <= row <= hunk.end

  isDifferentHunk: ->
    if @previousSelectedHunk? and @previousSelectedHunk.start? and @selectedHunk? and @selectedHunk.start?
      return @selectedHunk.start != @previousSelectedHunk.start
    return true

  getSelectedHunk: (currentRow) ->
    if !@selectedHunk? or @selectedHunkInvalidated or !@liesBetween(@selectedHunk, currentRow)
      @updateLineDiffDetails()
      @updateSelectedHunk(currentRow)

    @selectedHunkInvalidated = false

    isDifferent = @isDifferentHunk()

    @previousSelectedHunk = @selectedHunk

    {selectedHunk: @selectedHunk, isDifferent}

  updateSelectedHunk: (currentRow) ->
    @selectedHunk = null

    if @lineDiffDetails?
      for hunk in @lineDiffDetails
        if @liesBetween(hunk, currentRow)
          @selectedHunk = hunk
          break

  updateLineDiffDetails: () ->
    if !@lineDiffDetails? or @lineDiffDetailsInvalidated
      @prepareLineDiffDetails(@repo, @path, @text)

    @lineDiffDetailsInvalidated = false
    @lineDiffDetails

  prepareLineDiffDetails: (repo, path, text) ->
    @lineDiffDetails = null

    repo = repo.getRepo(path)
    repo.getLineDiffDetails(repo.relativize(path), text)

    rawLineDiffDetails = repo.getLineDiffDetails(repo.relativize(path), text)

    return unless rawLineDiffDetails?

    @lineDiffDetails = []
    hunk = null

    for {oldStart, newStart, oldLines, newLines, oldLineNumber, newLineNumber, line} in rawLineDiffDetails
      # process modifications and deletions only
      unless oldLines is 0 and newLines > 0
        # create a new hunk entry if the hunk start of the previous line
        # is different to the current
        if not hunk? or (newStart isnt hunk.start)
          newEnd = null
          kind = null
          if newLines is 0 and oldLines > 0
            newEnd = newStart
            kind = "d"
          else
            newEnd = newStart + newLines - 1
            kind = "m"

          hunk = {
            start: newStart, end: newEnd,
            oldLines: [], newLines: [],
            newString: "", oldString: ""
            kind
          }
          @lineDiffDetails.push(hunk)

        if newLineNumber >= 0
          hunk.newLines.push(line)
          hunk.newString += line
        else
          hunk.oldLines.push(line)
          hunk.oldString += line

  invalidate: (@repo, @path, @text) ->
    @selectedHunkInvalidated = true
    @lineDiffDetailsInvalidated = true
    @invalidatePreviousSelectedHunk()

  invalidatePreviousSelectedHunk: ->
    @previousSelectedHunk = null
