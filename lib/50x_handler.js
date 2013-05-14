//----------------------------------------------------------------------------------------------------------------------
// A simple handler for 50x errors.
//
// @module 50x_handler.js
//----------------------------------------------------------------------------------------------------------------------

var render = require('../util/swig').render;

var logger = require('./logging').getLogger('500');

//----------------------------------------------------------------------------------------------------------------------

function handle500(request, response, error)
{
    logger.error('Encountered error: \"%s\":\n%s', error, error.stack);

    response.writeHead(500,
        {
            "Content-Type": "text/html"
        });

    render(response, "50X.html", {
        error: "500 Internal Error",
        message: "An internal error occured: " + error.toString(),
        trace: error.stack
    }, true);
} // end handle500

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    handle500: handle500
}; // end exports

//----------------------------------------------------------------------------------------------------------------------