{ satisfies } = require 'semver'
{ EventEmitter2 } = require 'eventemitter2'
{ workspace, config, packages: packageManager } = atom

isFunction = (func) -> (typeof func) is 'function'

module.exports =
class ModuleManager extends EventEmitter2

  modules: {}
  version: '0.0.0'

  constructor: ->
    super
    @setMaxListeners 0
    #TODO update when package is enabled
    # config.on 'updated.core-disabledPackages', @update
    #TODO read version from package.json
    # { @version } = JSON.parse readFileSync 'package.json'
    #atom.workspace.on 'coffee-refactor-became-active', @update
    @update()

  destruct: ->
    # config.off 'updated.core-disabledPackages', @update
    #atom.workspace.off 'coffee-refactor-became-active', @update

    delete @modules

  update: =>
    @modules = {}
    # Search packages related to refactor package.
    for metaData in packageManager.getAvailablePackageMetadata()
      # Verify enabled, defined in engines, and satisfied version.
      { name, engines } = metaData
      continue unless !packageManager.isPackageDisabled(name) and
                      (requiredVersion = engines?.refactor)? and
                      satisfies @version, requiredVersion
      @activate name

  activate: (name) ->
    packageManager
    .activatePackage name
    .then (pkg) =>
      # Verify module interface.
      { Ripper } = module = pkg.mainModule
      unless Ripper? and
             Array.isArray(Ripper.scopeNames) and
             isFunction(Ripper::parse) and
             isFunction(Ripper::find)
        console.error "'#{name}' should implement Ripper.scopeNames, Ripper.parse() and Ripper.find()"
        return

      for scopeName in Ripper.scopeNames
        @modules[scopeName] = module

      @emit 'changed'

  getModule: (sourceName) ->
    @modules[sourceName]
