// ---------------------------------------------------------------------------------------------------------------------
// A smart wrapper around the `router` npm module.
//
// @module router.js
// ---------------------------------------------------------------------------------------------------------------------

var router = require('router');
var logger = require('./logging').getLogger('app.router');

// ---------------------------------------------------------------------------------------------------------------------

function Router()
{
    this._router = router();

    this.handlers = {
        'GET': 'get',
        'POST': 'post',
        'PUT': 'put',
        'HEAD': 'head',
        'DELETE': 'del',
        'OPTIONS': 'options',
        'ALL': 'all'
    };
} // end Router

Router.prototype.handleRequest = function (request, response, fallbackHandler)
{
    this._router(request, response, fallbackHandler);
}; // end handleRequest

Router.prototype.add = function()
{
    // I fucking HATE the arguments object.
    var args = Array.prototype.slice.call(arguments, 0);
    this._addRoutes(args);

    logger.debug('Adding routes: %s', logger.dump(args));
}; // end add

Router.prototype._addRoutes = function(routes)
{
    routes.forEach(function(route)
    {
        if(route.length == 1)
        {
            this._addRoute(route[0]);
        }
        else
        {
            this._addRoute(route[0], route[1]);
        } // end if
    }.bind(this));
}; // end _addRoutes

Router.prototype._addRoute = function(path, options)
{
    if(arguments.length == 1)
    {
        options = path;
        path = options.path;
    } // end if

    for(var key in Object.keys(this.handlers))
    {
        // Support 'GET' or 'get' for the key, but prefer 'GET' over 'get'.
        var handler = options[key] || options[key.toLowerCase()];

        if(typeof handler == 'function')
        {
            this._router[this.handlers[key]](path, handler);
        } // end if
    } // end for

}; // end _addRoute

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
    Router: Router
}; // end exports

// ---------------------------------------------------------------------------------------------------------------------