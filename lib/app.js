// ---------------------------------------------------------------------------------------------------------------------
// Provides the application class for Omega apps.
//
// @module app.js
// ---------------------------------------------------------------------------------------------------------------------
var http = require('http');
var socketio = require('socket.io');
var path = require('path');
var fs = require('fs');

var connect = require('connect');
var passport = require('passport');

var Router = require('./router').Router;
var Static = require('./static').Static;
var Config = require('./config').Config;

//----------------------------------------------------------------------------------------------------------------------

var mainDir = '';
try
{
    mainDir = path.dirname(require.main.filename);
}
catch(err) { } // Ignore exceptions. (which happen if you're requiring this from an interactive session)

// ---------------------------------------------------------------------------------------------------------------------

function OmegaApp()
{
    // Create a router for this application
    this.router = new Router();

    // Create a static handler for this application
    this.static = new Static();

    // Create a configuration manager for this application
    this._configMan = new Config();

    if(fs.existsSync(path.join(mainDir, 'settings.js')))
    {
        this._configMan.load();
    } // end if

    // Expose passport
    this.auth = passport;

    // Expose logging
    this.logging = require('./logging');
    this.logger = this.logging.getLogger('app');

    //---------------------------------------------------------------------
    // Setup http and socket.io
    //---------------------------------------------------------------------

    var middleware = this.config.middleware || [];
    var secret = this.config.secret || "WHYNOSECRET?";

    // Setup connect
    var _app = connect.apply(this, middleware)
        .use(this.router.middleware())
        .use(this.static.middleware())
        .use(function(request, response)
        {
            // 404
            require('./404_handler').handle404(request, response);
        })
        .use(function(error, request, response, next)
        {
            require('./50x_handler').handle50x(error, request, response);
        });

    // Bind our connect app to http, and then to socket.io
    this._http_app = http.createServer(_app);
    this._io = socketio.listen(this._http_app, {log: false});

    // Expose the socket io object
    this.sockets = this._io.sockets;
} // end App constructor

OmegaApp.prototype = {
    get config()
    {
        return this._configMan._config;
    } // end get
}; // end prototype

OmegaApp.prototype.requestHandler = function(request, response)
{
    this.router.handleRequest(request, response, function()
    {
        this.staticHandler(request, response);
    }.bind(this));
}; // end requestHandler

OmegaApp.prototype.staticHandler = function(request, response)
{
    this.static.serve(request, response);
}; // end staticHandler

OmegaApp.prototype.channel = function(channel)
{
    return this._io.of(channel);
}; // end channel

OmegaApp.prototype.loadConfig = function(filename)
{
    this._configMan.load(filename);
}; // end loadConfig

OmegaApp.prototype.listen = function(port)
{
    port = port || 8080;
    this._http_app.listen(port);

    this.logger.info("Omega Application listening on port %s", port);
}; // end listen

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
    App: OmegaApp
}; // end exports

// ---------------------------------------------------------------------------------------------------------------------