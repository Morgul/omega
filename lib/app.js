// ---------------------------------------------------------------------------------------------------------------------
// Provides the application class for Omega apps.
//
// @module app.js
// ---------------------------------------------------------------------------------------------------------------------
var http = require('http');
var socketio = require('socket.io');

var Router = require('./lib/router').Router;
var Static = require('./lib/static').Static;

// ---------------------------------------------------------------------------------------------------------------------

function OmegaApp()
{
    // Create a router for this application
    this.router = new Router();

    // Create a static handler for this application
    this.static = new Static();

    // Build an app to bind socket.io to
    this._http_app = http.createServer(this.requestHandler);
    this._io = socketio.listen(this._http_app);

} // end App constructor

App.prototype.requestHandler = function(request, response)
{
    this.router.handleRequest(request, response, this.staticHandler);
}; // end requestHandler

App.prototype.staticHandler = function(request, response)
{
    this.static.serve(request, response);
}; // end staticHandler

App.prototype.listen = function(port)
{
    port = port || 8080;
    this._http_app.listen(port);
}; // end listen

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
    App: OmegaApp
}; // end exports

// ---------------------------------------------------------------------------------------------------------------------