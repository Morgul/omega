// ---------------------------------------------------------------------------------------------------------------------
// Main omega-wf module.
//
// @module omega-wf.js
// ---------------------------------------------------------------------------------------------------------------------

var App = require('./lib/app').App;
var AuthMan = require('./lib/auth').Auth;

var render = require('./util/swig').render;
var sequelize = require('./util/sequelize');

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
        dump: function(){ sequelize.dump(DbMan); },
        sync: function(){ sequelize.sync(DbMan); },
        drop: function(){ sequelize.drop(DbMan); }
    }
}; // end exports

// ---------------------------------------------------------------------------------------------------------------------