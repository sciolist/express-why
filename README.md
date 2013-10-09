express-why
===========

why() generator support for express routes and middleware.

Usage
-----

```js
var express = require('express');
var app = express();

// skip app-argument to add generator support for all express applications.
require('express-why')(app);

app.get('/', function* (req, res, next) {
  var data = yield require('fs').readFile('package.json', yield 'cb');
  res.send(data);
});

app.listen(3000);
```

