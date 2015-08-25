{ dirname, filename, extname, sep } = require 'path'
firstDirname = (filepath) ->
  filepath.split(sep)[0]
secondDirname = (filepath) ->
  filepath.split(sep)[1]

module.exports = (grunt) ->
  grunt.initConfig

    pkg: grunt.file.readJSON 'package.json'

    esteWatch:
      options:
        dirs: [
          'keymaps/**/*'
          'lib/**/*'
          'menus/**/*'
          'spec/**/*'
          'styles/**/*'
          'node_modules/atom-refactor/**/*'
          'vender/coffeescript/lib/**/*'
        ]
        livereload:
          enabled: false
      '*': ->
        [ 'apm:test' ]

  grunt.loadNpmTasks 'grunt-notify'
  grunt.loadNpmTasks 'grunt-este-watch'

  grunt.registerTask 'apm:test', ->
    done = @async()
    grunt.util.spawn
      cmd: 'apm'
      args: [ 'test' ]
    , (err, result, code) ->
      if err?
        grunt.util.error err
      if result?
        grunt.log.writeln result
      done()

  grunt.registerTask 'cake:generate', ->
    done = @async()
    grunt.util.spawn
      cmd: 'cake'
      args: [ 'generate' ]
    , (err, result, code) ->
      if err?
        grunt.util.error err
      if result?
        grunt.log.writeln result
      done()

  grunt.registerTask 'default', [
    'apm:test'
    'esteWatch'
  ]
