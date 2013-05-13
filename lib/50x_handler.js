//----------------------------------------------------------------------------------------------------------------------
// A simple handler for 50x errors.
//
// @module 50x_handler.js
//----------------------------------------------------------------------------------------------------------------------

var logger = require('./logging').getLogger('50X');

//----------------------------------------------------------------------------------------------------------------------

function handle500(request, response, error)
{
    logger.error('Encountered error: \"%s\":\n%s', error, error.stack);

    //TODO: Make this uber sexy, with nice output, and anything else that might be useful.
    response.writeHead(500,
        {
            "Content-Type": "text/html"
        });

    response.end(
        "<html><body>"
            + "<h1>50X Server Error</h1>"
            + "<p>Encountered error: \""
            + error
            + "\"</p>"
            + "</body></html>"
    );
} // end handle500

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    handle500: handle500
}; // end exports

//----------------------------------------------------------------------------------------------------------------------