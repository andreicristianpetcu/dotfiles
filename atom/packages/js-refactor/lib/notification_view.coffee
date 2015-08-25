###
Borrow from feedback package
###

{$, View} = require 'atom'

module.exports =
class NotificationView extends View
  @warn: ->
    @li =>
      @span "'"
      @a href: "https://atom.io/packages/js-refactor", "js-refactor"
      @span "' package requires '"
      @a href: "https://atom.io/packages/refactor", "refactor"
      @span "' package"
  @content: ->
    @div tabindex: -1, class: 'notification overlay from-top native-key-bindings', =>
      @h1 "Requires related package installation"
      @ul => @warn()
      @p "You can install and activate packages using the preference pane."

  initialize: ->
    if ($notification = atom.workspaceView.find('.notification')).length is 0
      atom.workspaceView.prepend @
    else
      html = @constructor.buildHtml -> @warn()
      $notification.find('ul').append html

    @subscribe this, 'focusout', =>
      # during the focusout event body is the active element. Use nextTick to determine what the actual active element will be
      process.nextTick =>
        @detach() unless @is(':focus') or @find(':focus').length > 0

    @subscribe atom.workspaceView, 'core:cancel', => @detach()

    @focus()
