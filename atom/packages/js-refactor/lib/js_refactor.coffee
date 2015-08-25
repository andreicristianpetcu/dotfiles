Ripper = require './ripper'
#NotificationView = require './notification_view'

{ packages: packageManager } = atom

module.exports =
  activate: ->
    return if 'refactor' in packageManager.getAvailablePackageNames() and
              !packageManager.isPackageDisabled 'refactor'
    #new NotificationView
  deactivate: ->
  serialize: ->
  Ripper: Ripper
