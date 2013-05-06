// ---------------------------------------------------------------------------------------------------------------------
// Provides the application class for Omega apps.
//
// @module app.js
// ---------------------------------------------------------------------------------------------------------------------
var http = require('http');
var socketio = require('socket.io');
var node_static = require('note-static');

var Router = require('./lib/router').Router;

// ---------------------------------------------------------------------------------------------------------------------

function OmegaApp()
{
    // Setup static file serving
    this._staticFiles = new node_static.Server('./client');

    // Build an app to bind socket.io to
    this._http_app = http.createServer(staticHandler);
    this._io = socketio.listen(this._http_app);

    // Create a router for this application
    this.router = new Router();
} // end App constructor

App.prototype.staticHandler = function(request, response)
{
    this._staticFiles.serve(request, response);
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