// ---------------------------------------------------------------------------------------------------------------------
// A smart wrapper around the `router` npm module.
//
// @module router.js
// ---------------------------------------------------------------------------------------------------------------------

var router = require('router');

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

Router.prototype.addRoutes = function(routes)
{
    routes.forEach(function(route)
    {
        if(route.length == 1)
        {
            this.addRoute(route[0]);
        }
        else
        {
            this.addRoute(route[0], route[1]);
        } // end if
    }.bind(this));
}; // end addRoutes

Router.prototype.addRoute = function(path, options)
{
    if(arguments.length == 1)
    {
        options = path;
        path = options.path;
    } // end if

    for(var key in Object.keys(this.handlers))
    {
        var handler = options[key];

        if(typeof handler == 'function')
        {
            this._router[this.handlers[key]](path, handler);
        } // end if
    } // end for

}; // end addRoute

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
    Router: Router
}; // end exports

// ---------------------------------------------------------------------------------------------------------------------