# Refactor Package

**:zap:Notification:zap:: Activate 'Use React Editor' in preferences pane.**
Refactor package greater than v0.3 no longer supports for the legacy editor.
If you want more info about the React Editor, you can see [React Editor Enabled by Default](http://blog.atom.io/2014/07/22/default-to-react-editor.html).

Let's refactor code!
With this package, you can rename the name of variables and functions easily.

![capture_rename](https://cloud.githubusercontent.com/assets/514164/2929354/b4e848d4-d788-11e3-99c2-620f406d5e6f.gif)

## Language plugins

This package works with these language plugins.
You can install using the preferences pane.

* [coffee-refactor](https://atom.io/packages/coffee-refactor) for CoffeeScript
* [js-refactor](https://atom.io/packages/js-refactor) for JavaScript

## Usage

1. Set cursor to a symbol.
2. Start renaming by using `ctrl-alt-r`.
3. Type new name.
4. Finish renaming by using `enter` or removing cursor from the focused symbol.

## User setting

* Override [keymap](kaymaps/refactor.cson) by using `Atom > Open Your Keymap`.
* Override [stylesheet](styles/refactor.less) by using `Atom > Open Your Stylesheet`.

## API Documentation (for plugin developer)

### package.json

Add `refactor` as `engines` in `package.json`.

```
{
  ...
  "engines": {
    "atom": ">0.50.0",
    "refactor": ">0.4.0"
  },
  ...
}
```

### Interface

You should implement `Ripper` class in main module.

* `Ripper.scopeNames []String` : **[Required]** Array of scope name, like 'source.coffee', 'source.js' and all that.
* `Ripper#parse(code String, callback Function)` : **[Required]** Parse code, and you should callback when the parsing process is done. Callback specify the params as an array of error `Object`. The error `Object` should have params `range` and `message`.
* `Ripper#find(point Point) []Range` : **[Required]** Return an array of found symbols' [`Range`](https://atom.io/docs/api/latest/api/classes/Range) at the passed [`Point`](https://atom.io/docs/api/latest/api/classes/Point).

```coffeescript
{ Range, Point } = require 'atom'
class Riper
  @scopeNames: []
  parse: (code, callback) ->
    # parse code
    callback [
      range = new Range()
      message: 'foo'
    ]
  find: (point) ->
    # find references
    [
      new Range()
      new Range()
      ...
      new Range()
    ]
```

### Examples

* [minodisk/coffee-refactor](https://github.com/minodisk/coffee-refactor)
* [minodisk/js-refactor](https://github.com/minodisk/js-refactor)


## See

* [Changelog](CHANGELOG.md)
