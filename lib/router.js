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
} // end Router

Router.prototype.handleRequest = function (request, response, fallbackHandler)
{
    this._router(request, response, fallbackHandler);
}; // end handleRequest

Router.prototype.addRoutes = function(routes)
{
    routes.forEach(function(route)
    {
        this.addRoute(route[0], route[1], route[2]);
    }.bind(this));
}; // end addRoutes

Router.prototype.addRoute = function(verb, path, handler)
{
    if(arguments.length == 2)
    {
        handler = path;
        path = verb;
        verb = 'get';

    } // end if

    switch(verb.toUpperCase())
    {
        case 'ALL':
            this._addRouteAll(path, handler);
            break;

        case 'OPTIONS':
            this._addRouteOpts(path, handler);
            break;

        case 'DELETE':
            this._addRouteDel(path, handler);
            break;

        case 'HEAD':
            this._addRouteHead(path, handler);
            break;

        case 'PUT':
            this._addRoutePut(path, handler);
            break;

        case 'POST':
            this._addRoutePost(path, handler);
            break;

        case 'GET':
        default:
            this._addRouteGet(path, handler);
            break;
    } // end switch
}; // end addRoute

Router.prototype._addRouteGet = function(path, handler)
{
    this._router.get(path, handler);
}; // end _addRouteGet

Router.prototype._addRoutePost = function(path, handler)
{
    this._router.post(path, handler);
}; // end _addRoutePost

Router.prototype._addRoutePut = function(path, handler)
{
    this._router.put(path, handler);
}; // end _addRoutePut

Router.prototype._addRouteHead = function(path, handler)
{
    this._router.head(path, handler);
}; // end _addRouteHead

Router.prototype._addRouteDel = function(path, handler)
{
    this._router.del(path, handler);
}; // end _addRouteDel

Router.prototype._addRouteOpts = function(path, handler)
{
    this._router.options(path, handler);
}; // end _addRouteOpts

Router.prototype._addRouteAll = function(path, handler)
{
    this._router.all(path, handler);
}; // end _addRouteAll

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
    Router: Router
}; // end exports

// ---------------------------------------------------------------------------------------------------------------------