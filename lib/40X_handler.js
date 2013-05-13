//----------------------------------------------------------------------------------------------------------------------
// Handles returning a nice, pretty 404 error.
//
// @module 40X_handler.js
//----------------------------------------------------------------------------------------------------------------------

var app = require('../omega').app;
var logger = require('./logging').getLogger('404');

//----------------------------------------------------------------------------------------------------------------------

function handle400(request, response, message)
{
    logger.warn('Access Forbidden: \"%s\"', request.url);

    //TODO: Make this uber sexy, with nice output, and anything else that might be useful.
    response.writeHead(400,
        {
            "Content-Type": "text/html"
        });

    response.end(
        "<html><body>"
            + "<h1>400 Bad Request</h1>"
            + "<p>Bad Request: \""
            + message
            + "\"</p>"
            + "</body></html>"
    );
} // end handle400

function handle403(request, response)
{
    logger.warn('Access Forbidden: \"%s\"', request.url);

    //TODO: Make this uber sexy, with nice output, and anything else that might be useful.
    response.writeHead(403,
        {
            "Content-Type": "text/html"
        });

    response.end(
        "<html><body>"
            + "<h1>403 FORBIDDEN</h1>"
            + "<p>Access denied: \""
            + request.url
            + "\"</p>"
            + "</body></html>"
    );
} // end handle403
function handle404(request, response)
{
    if(app && app.config.DEBUG && request.url == "/")
    {
        response.writeHead(200,
            {
                "Content-Type": "text/html"
            });

        response.end(
            "<html><body>"
                + "<h1>It Works!</h1>"
                + "<p>Your omega-wf app is successfully running!</p>"
                + "</body></html>"
        );
    }
    else
    {
        logger.warn('Unable to find handler for: \"%s\"', request.url);

        //TODO: Make this uber sexy, with nice output, and anything else that might be useful.
        response.writeHead(404,
        {
            "Content-Type": "text/html"
        });

        response.end(
            "<html><body>"
                + "<h1>404 Not Found</h1>"
                + "<p>Unable to find handler for: \""
                + request.url
                + "\"</p>"
                + "</body></html>"
        );
    } // end if
} // end handle404

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    handle400: handle400,
    handle403: handle403,
    handle404: handle404
}; // end exports

//----------------------------------------------------------------------------------------------------------------------