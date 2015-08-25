NodeDebuggerView = require './node-debugger-view'
Event = require 'geval'
{CompositeDisposable} = require 'atom'
{Debugger, ProcessManager} = require './debugger'
jumpToBreakpoint = require './jump-to-breakpoint'
logger = require './logger'
os = require 'os'

processManager = null
_debugger = null
onBreak = null

initNotifications = (_debugger) ->
  _debugger.on 'connected', ->
    atom.notifications.addSuccess('connected, enjoy debugging : )')

  _debugger.on 'disconnected', ->
    atom.notifications.addInfo('finish debugging : )')

module.exports =
  nodeDebuggerView: null
  config:
    nodePath:
      type: 'string'
      default: if os.platform() is 'win32' then 'node.exe' else '/bin/node'
    debugPort:
      type: 'number'
      minium: 5857
      maxium: 65535
      default: 5858
    debugHost:
      type: 'string'
      default: '127.0.0.1'
    nodeArgs:
      type: 'string'
      default: ''
    appArgs:
      type: 'string'
      default: ''
    isCoffeeScript:
      type: 'boolean'
      default: false

  activate: () ->
    @disposables = new CompositeDisposable()
    processManager = new ProcessManager(atom)
    _debugger = new Debugger(atom, processManager)
    initNotifications(_debugger)
    @disposables.add atom.commands.add('atom-workspace', {
      'node-debugger:start-resume': @startOrResume
      'node-debugger:stop': @stop
      'node-debugger:toggle-breakpoint': @toggleBreakpoint
      'node-debugger:step-next': @stepNext
      'node-debugger:step-in': @stepIn
      'node-debugger:step-out': @stepOut
    })

    jumpToBreakpoint(_debugger)

  startOrResume: =>
    if _debugger.isConnected()
      _debugger.reqContinue()
    else
      processManager.start()
      NodeDebuggerView.show(_debugger)

  toggleBreakpoint: =>
    editor = atom.workspace.getActiveTextEditor()
    path = editor.getPath()
    {row} = editor.getCursorBufferPosition()
    _debugger.toggleBreakpoint(editor, path, row)

  stepNext: =>
    _debugger.step('next', 1)

  stepIn: =>
    _debugger.step('in', 1)

  stepOut: =>
    _debugger.step('out', 1)

  stop: =>
    processManager.cleanup()
    _debugger.cleanup()
    NodeDebuggerView.destroy()
    jumpToBreakpoint.cleanup()

  deactivate: ->
    logger.info 'deactive', 'stop running plugin'
    jumpToBreakpoint.destroy()
    @stop()
    @disposables.dispose()
    NodeDebuggerView.destroy()

  serialize: ->
    nodeDebuggerViewState: @nodeDebuggerView.serialize()
