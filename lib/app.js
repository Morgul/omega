// ---------------------------------------------------------------------------------------------------------------------
// Provides the application class for Omega apps.
//
// @module app.js
// ---------------------------------------------------------------------------------------------------------------------
var http = require('http');
var socketio = require('socket.io');

var Router = require('./router').Router;
var Static = require('./static').Static;

// ---------------------------------------------------------------------------------------------------------------------

function OmegaApp()
{
    // Create a router for this application
    this.router = new Router();

    // Create a static handler for this application
    this.static = new Static();

    // Build an app to bind socket.io to
    this._http_app = http.createServer(this.requestHandler.bind(this));
    this._io = socketio.listen(this._http_app);

    // Expose the socket io object
    this.sockets = this._io.sockets;
} // end App constructor

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

OmegaApp.prototype.listen = function(port)
{
    port = port || 8080;
    this._http_app.listen(port);
}; // end listen

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
    App: OmegaApp
}; // end exports

// ---------------------------------------------------------------------------------------------------------------------