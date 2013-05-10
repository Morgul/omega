// ---------------------------------------------------------------------------------------------------------------------
// Main omega module.
//
// @module omega.js
// ---------------------------------------------------------------------------------------------------------------------

var render = require('./util/render');
var App = require('./lib/app').App;
var AuthMan = require('./lib/auth').Auth;
var ModelMan = require('./lib/models').ModelMan;

// Create a new omega application
var app = new App();

// Create a new AuthManager
var auth = new AuthMan();

// Create a new ModelManager
var db = new ModelMan();

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
    app: app,
    auth: auth,
    db: db,
    utils: {
        render: render
    }
}; // end exports

// ---------------------------------------------------------------------------------------------------------------------