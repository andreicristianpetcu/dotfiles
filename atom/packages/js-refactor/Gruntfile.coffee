{ spawn } = require 'child_process'

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

  grunt.registerTask 'default', [
    'apm:test'
    'esteWatch'
  ]
