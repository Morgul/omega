//----------------------------------------------------------------------------------------------------------------------
// A simple handler for 50x errors.
//
// @module 50x_handler.js
//----------------------------------------------------------------------------------------------------------------------

var logger = require('./logging').getLogger('50X');

//----------------------------------------------------------------------------------------------------------------------

function handle50x(error, request, response)
{
    logger.error('Encountered error: \"%s\"', error);

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
} // end handle50x

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    handle50x: handle50x
}; // end exports

//----------------------------------------------------------------------------------------------------------------------