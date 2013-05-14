//----------------------------------------------------------------------------------------------------------------------
// Handles returning a nice, pretty 404 error.
//
// @module 40X_handler.js
//----------------------------------------------------------------------------------------------------------------------

var logger = require('./logging').getLogger('40X');
var render = require('../util/swig').render;
var absPath = require('../util/swig').omegaPath;

//----------------------------------------------------------------------------------------------------------------------

function handle400(request, response, message)
{
    var app = require('../omega').app;

    logger.warn('400: Bad Request: \"%s\"', request.url);

    response.writeHead(400,
        {
            "Content-Type": "text/html"
        });

    render(response, absPath("40X.html"), {
        base: absPath("base.html"),
        debug: app.config.DEBUG,
        error: "400 Bad Request",
        message: "An error was encountered: " + message
    });
} // end handle400

function handle403(request, response)
{
    var app = require('../omega').app;

    logger.warn('403: Access Forbidden: \"%s\"', request.url);

    response.writeHead(403,
        {
            "Content-Type": "text/html"
        });

    render(response, absPath("40X.html"), {
        base: absPath("base.html"),
        debug: app.config.DEBUG,
        error: "403 Forbidden",
        message: "Access Denied: " + request.url
    });
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

        render(response, absPath("works.html"), {
            base: absPath("base.html"),
            debug: app.config.DEBUG
        });
    }
    else
    {
        logger.warn('404: Unable to find handler for: \"%s\"', request.url);

        response.writeHead(404,
        {
            "Content-Type": "text/html"
        });

        render(response, absPath("40X.html"), {
            base: absPath("base.html"),
            debug: app.config.DEBUG,
            error: "404 Not Found",
            message: "Unable to find handler for url: \"" + request.url + "\""
        });
    } // end if
} // end handle404

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    handle400: handle400,
    handle403: handle403,
    handle404: handle404
}; // end exports

//----------------------------------------------------------------------------------------------------------------------