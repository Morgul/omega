// ---------------------------------------------------------------------------------------------------------------------
// A wrapper around node-static.
//
// @module static.js
// ---------------------------------------------------------------------------------------------------------------------

var ecstatic = require('ecstatic');

// ---------------------------------------------------------------------------------------------------------------------

function StaticManager()
{
    this.staticFiles = [];
} // end StaticManager

StaticManager.prototype.add = function()
{
    // I fucking HATE the arguments object.
    var args = Array.prototype.slice.call(arguments, 0);

    if(!(args instanceof Array))
    {
        // Assume it's a solitary object
        args = [args];
    } // end if

    args.forEach(function(opts)
    {
        this._addStatic(opts.url, opts.path, opts.options);
    });
}; // end add

StaticManager.prototype._addStatic = function(url, path, options)
{
    options = options || {};
    options.baseDir = url;
    options.root = path;

    this.staticFiles.push(ecstatic(options));
}; // addStaticDir

StaticManager.prototype.serve = function(request, response)
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
            // 404?
        } // end if
    } // end tryNextHandler

    tryNextHandler();
}; // end serve

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
    Static: StaticManager
}; // end exports

// ---------------------------------------------------------------------------------------------------------------------