// ---------------------------------------------------------------------------------------------------------------------
// Main omega-wf module.
//
// @module omega-wf.js
// ---------------------------------------------------------------------------------------------------------------------

var App = require('./lib/app').App;
var AuthMan = require('./lib/auth').Auth;

var render = require('./util/swig').render;
var Paginator = require('./util/paginator');

// Create a new omega-wf application
var app = new App();

// Create a new AuthManager
var auth = new AuthMan();

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
    app: app,
    auth: auth,
    logging: require('./lib/logging'),
    db: require('./lib/database').createDbMan(app.config),
    utils: {
        swig: require('swig'),
        render: render,
        Paginator: Paginator,
        dump: function()
        {
            var sequelize = require('./util/sequelize');
            sequelize.dump();
        },
        sync: function()
        {
            var sequelize = require('./util/sequelize');
            sequelize.sync();
        },
        drop: function()
        {
            var sequelize = require('./util/sequelize');
            sequelize.drop();
        }
    }
}; // end exports

// ---------------------------------------------------------------------------------------------------------------------