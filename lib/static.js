// ---------------------------------------------------------------------------------------------------------------------
// A wrapper around node-static.
//
// @module static.js
// ---------------------------------------------------------------------------------------------------------------------

var ecstatic = require('ecstatic');
var logger = require('./logging').getLogger('app.static');

// ---------------------------------------------------------------------------------------------------------------------

function StaticManager()
{
    this.staticFiles = [];
} // end StaticManager

StaticManager.prototype.add = function()
{
    // I fucking HATE the arguments object.
    var args = Array.prototype.slice.call(arguments, 0);

    logger.debug('Adding static files: %s', logger.dump(args));

    args.forEach(function(opts)
    {
        this._addStatic(opts.url, opts.path, opts.options);
    }.bind(this));
}; // end add

StaticManager.prototype._addStatic = function(url, path, options)
{
    options = options || {};
    options.baseDir = url;
    options.root = path;

    this.staticFiles.push(ecstatic(options));
}; // addStaticDir

StaticManager.prototype.middleware = function()
{
    return function(request, response, next)
    {
        var remainingHandlers = this.staticFiles.slice();
        function tryNextHandler()
        {
            if(remainingHandlers.length > 0)
            {
                remainingHandlers.shift()(request, response, tryNextHandler);
            }
            else
            {
                next();
            } // end if
        } // end tryNextHandler

        tryNextHandler();
    }.bind(this);
}; // end serve

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
    Static: StaticManager
}; // end exports

// ---------------------------------------------------------------------------------------------------------------------