{CompositeDisposable} = require 'atom'
path = require 'path'

module.exports =
  subscriptions: null

  activate: (state) ->
    @subscriptions = new CompositeDisposable
    @subscriptions.add atom.commands.add 'atom-workspace', 
      'open-git-modified-files:open': => @open()

  deactivate: ->
    @subscriptions.dispose()

  open: ->
    repos = atom.project.getRepositories()
    if repos?
      for repo in repos
        break unless repo?
        for filePath of repo.statuses
          if repo.isPathModified(filePath) or repo.isPathNew(filePath)
            atom.workspace.open(path.join(repo.repo.workingDirectory, filePath))
    else
      atom.beep()
