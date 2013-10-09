var why = require('why');

module.exports = exports = function configure(app) {
  if(arguments.length === 0) setupGlobal();
  else setupLocal(app);
}

function setupLocal(app) {
  app.use = replaceArguments(app.use);
  if(app._router) {
    app._router.route = replaceArguments(app._router.route);
  }
}

function setupGlobal() {
  var connect = require('connect');
  var router = require('express/lib/router');

  connect.proto.use = replaceArguments(connect.proto.use);
  router.prototype.route = replaceArguments(router.prototype.route);
}

function replaceArguments(fn) {
  var wrapped = function() {
    for(var i=0; i<arguments.length; ++i) {
      var v = arguments[i];
      if(v && v.constructor && v.constructor.name === 'GeneratorFunction') {
        v = wrap(v);
      }
      arguments[i] = v;
    }
    return fn.apply(this, arguments);
  }
  wrapped.toString = function() { return 'expressWhy(' + fn.toString() + ')'; }
  return wrapped;
}

function wrap(cb) {
  var inner = why.create(cb);
  var wrapped = function route(req, res, next) {
    return inner.apply(this, arguments).then(function(){}, next);
  }
  wrapped.toString = function() { return 'why(' + inner.toString() + ')'; };
  return wrapped;
}

