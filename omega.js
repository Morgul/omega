// ---------------------------------------------------------------------------------------------------------------------
// Main omega-wf module.
//
// @module omega-wf.js
// ---------------------------------------------------------------------------------------------------------------------

var render = require('./util/render');
var sequelize = require('./util/sequelize');
var App = require('./lib/app').App;
var AuthMan = require('./lib/auth').Auth;

// Create a new omega-wf application
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
        render: render,
        sync: function(){ sequelize.sync(DbMan); },
        drop: function(){ sequelize.drop(DbMan); }
    }
}; // end exports

// ---------------------------------------------------------------------------------------------------------------------