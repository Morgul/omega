//----------------------------------------------------------------------------------------------------------------------
// Handles returning a nice, pretty 404 error.
//
// @module 40X_handler.js
//----------------------------------------------------------------------------------------------------------------------

var logger = require('./logging').getLogger('40X');
var render = require('../util/swig').render;

//----------------------------------------------------------------------------------------------------------------------

function handle400(request, response, message)
{
    logger.warn('400: Bad Request: \"%s\"', request.url);

    response.writeHead(400,
        {
            "Content-Type": "text/html"
        });

    render(response, "40X.html", {
        error: "400 Bad Request",
        message: "An error was encountered: " + message
    }, true);
} // end handle400

function handle403(request, response)
{
    logger.warn('403: Access Forbidden: \"%s\"', request.url);

    response.writeHead(403,
        {
            "Content-Type": "text/html"
        });

    render(response, "40X.html", {
        error: "403 Forbidden",
        message: "Access Denied: " + request.url
    }, true);
} // end handle403

function handle404(request, response)
{
    var app = require('../omega').app;

    if(app && app.config.DEBUG && request.url == "/")
    {
        response.writeHead(200,
            {
                "Content-Type": "text/html"
            });

        render(response, "works.html", {}, true);
    }
    else
    {
        logger.warn('404: Unable to find handler for: \"%s\"', request.url);

        response.writeHead(404,
        {
            "Content-Type": "text/html"
        });

        render(response, "40X.html", {
            error: "404 Not Found",
            message: "Unable to find handler for url: \"" + request.url + "\""
        }, true);
    } // end if
} // end handle404

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    handle400: handle400,
    handle403: handle403,
    handle404: handle404
}; // end exports

//----------------------------------------------------------------------------------------------------------------------