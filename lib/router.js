// ---------------------------------------------------------------------------------------------------------------------
// A smart wrapper around the `router` npm module.
//
// @module router.js
// ---------------------------------------------------------------------------------------------------------------------

var mime = require('mime');
var path = require('path');
var fs = require('fs');

var router = require('router');
var handler40X = require('./40X_handler');
var handler50X = require('./50X_handler');

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

    // Check for static files
    if(options.path)
    {
        this._router.get(options.url, this.static(options));
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

Router.prototype.static = function(staticOpts)
{
    var options = staticOpts.options || {
        autoIndex: true
    };

    return function(req, resp)
    {
        function serveFile(filename)
        {
            if(/\/\.\.\//.test(filename))
            {
                // This is a simple attempt at security.
                handler40X.handle400(req, resp, "Invalid Path.");
            } // end if

            fs.stat(filename, function(error, stats)
            {
                if(error)
                {
                    if(error.code == 'ENOENT')
                    {
                        handler40X.handle404(req, resp);
                        return;
                    }
                    else if(error.code == 'EACCES')
                    {
                        handler40X.handle403(req, resp);
                    }
                    else
                    {
                        handler50X.handle500(req, resp, error.stack || error.toString());
                    } // end if

                    return;
                } // end if

                if (stats.isDirectory())
                {
                    if(options.autoIndex)
                    {
                        filename += '/index.html';
                        serveFile(filename);
                    }
                    else
                    {
                        handler40X.handle403(req, resp);
                        return;
                    } // end if
                } // end if

                try
                {
                    // Stream the file
                    var stream = fs.createReadStream(filename);
                }
                catch(error)
                {
                    handler50X.handle500(req, resp, error);
                    return;
                } // end try/catch

                // Write out the file
                resp.writeHead(200, {"Content-Type": mime.lookup(filename)});
                stream.pipe(resp);
            });
        } // end serveFile

        var filename = path.join(staticOpts.path, req.params.wildcard);
        serveFile(filename);
    }; // end func
}; // end static

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
    Router: Router
}; // end exports

// ---------------------------------------------------------------------------------------------------------------------