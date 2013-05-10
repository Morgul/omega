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

Router.prototype.middleware = function()
{
    return function(request, response, next)
    {
        this._router(request, response, function()
        {
            next();
        });
    }.bind(this);
};

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
        this._addRoute(route);
    }.bind(this));
}; // end _addRoutes

Router.prototype._addRoute = function(path, options)
{
    if(arguments.length == 1)
    {
        options = path;
        path = options.url;
    } // end if

    for(var key in this.handlers)
    {
        // Support 'GET' or 'get' for the key, but prefer 'GET' over 'get'.
        var handler = options[key] || options[key.toLowerCase()];

        if(typeof handler == 'function')
        {
            logger.debug("Adding handler for path: \"%s\"", path);
            this._router[this.handlers[key]](path, handler);
        }
        else
        {
            if(handler == undefined)
            {
                logger.debug("No defined handler for verb \"%s\".", key);
            }
            else
            {
                logger.error("Attempted to add a handler that is not a valid function! Handler: %s", logger.dump(handler));
            } // end if
        } // end if
    } // end for
}; // end _addRoute

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
    Router: Router
}; // end exports

// ---------------------------------------------------------------------------------------------------------------------