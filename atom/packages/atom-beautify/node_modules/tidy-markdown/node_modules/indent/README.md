# Indent

Indent a string.

## Install

```
npm install indent
```

## Usage

```js
var indent = require('indent');

indent('hello\nworld', 2);
// "  hello\n  world"

indent('hello\nworld', '  ');
// "  hello\n  world"

indent('hello\nworld');
// "  hello\n  world"

indent('hello\nworld', '\t');
// "\thello\n\tworld"
```