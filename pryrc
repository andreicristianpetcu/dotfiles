if defined?(PryDebugger)
  Pry.commands.alias_command 'c', 'continue'
  Pry.commands.alias_command 's', 'step'
  Pry.commands.alias_command 'n', 'next'
  Pry.commands.alias_command 'f', 'finish'
end

if defined?(PryNav)
  Pry.commands.alias_command 'c', 'continue'
  Pry.commands.alias_command 's', 'step'
  Pry.commands.alias_command 'n', 'next'
end

Pry.config.history.file = "~/.irb_history"

# require "awesome_print"
# AwesomePrint.pry!
# Pry.config.editor = "emacsclient"
Pry.config.editor = proc { |file, line| "emacsclient +#{line} #{file}" }