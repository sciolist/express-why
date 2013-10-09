var why = require('why');

module.exports = exports = function configure(app) {
  if(arguments.length === 0) setupGlobal();
  else setupLocal(all);
}

function setupLocal(app) {
  app.use = replaceArguments(app.use);
  if(app._router) {
    app._router.route = replaceArguments(app._router.route);
  }
}

function setupGlobal() {
  var app = require('express/lib/application')
  var router = require('express/lib/router');

  app.use = replaceArguments(app.use);
  router.prototype.route = replaceArguments(router.prototype.route);
}

function replaceArguments(fn) {
  return function() {
    for(var i=0; i<arguments.length; ++i) {
      var v = arguments[i];
      if(v && v.constructor && v.constructor.name === 'GeneratorFunction') {
        v = wrap(v);
      }
      arguments[i] = v;
    }
    return fn.apply(this, arguments);
  }
}

function wrap(cb) {
  var inner = why.create(cb);
  var wrapped = function route(req, res, next) {
    return inner.apply(this, arguments).then(function(){}, next);
  }
  wrapped.toString = function() { return 'why(' + inner.toString() + ')'; };
  return wrapped;
}

