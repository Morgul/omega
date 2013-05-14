//----------------------------------------------------------------------------------------------------------------------
// A simple handler for 50x errors.
//
// @module 50x_handler.js
//----------------------------------------------------------------------------------------------------------------------

var render = require('../util/swig').render;
var absPath = require('../util/swig').omegaPath;

var logger = require('./logging').getLogger('500');

//----------------------------------------------------------------------------------------------------------------------

function handle500(request, response, error)
{
    var app = require('../omega').app;

    logger.error('Encountered error: \"%s\":\n%s', error, error.stack);

    response.writeHead(500,
        {
            "Content-Type": "text/html"
        });

    render(response, absPath("50X.html"), {
        base: absPath("base.html"),
        debug: app.config.DEBUG,
        error: "500 Internal Error",
        message: "An internal error occured: " + error.toString(),
        trace: error.stack
    });
} // end handle500

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    handle500: handle500
}; // end exports

//----------------------------------------------------------------------------------------------------------------------