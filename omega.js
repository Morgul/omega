// ---------------------------------------------------------------------------------------------------------------------
// Main omega module.
//
// @module omega.js
// ---------------------------------------------------------------------------------------------------------------------

var render = require('./util/render');
var App = require('./lib/app').App;
var AuthMan = require('./lib/auth').Auth;

// Create a new omega application
var app = new App();

// Create a new AuthManager
var auth = new AuthMan();

// Create a database manager
var DbMan = require('./lib/database').createDbMan(app.config);

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
    app: app,
    auth: auth,
    db: DbMan,
    utils: {
        render: render
    }
}; // end exports

// ---------------------------------------------------------------------------------------------------------------------