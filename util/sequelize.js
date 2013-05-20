//----------------------------------------------------------------------------------------------------------------------
// Helpers for working with sequelize.
//
// @module sequelize.js
//----------------------------------------------------------------------------------------------------------------------

var path = require('path');
var app = require('../omega').app;

var package = require(path.resolve('./package.json'));

// Override the main function.
app.init(function()
{
    app.setMainFunc(function(){});
});

// Require the main omega app file
require(path.resolve('./' + package.main));

//----------------------------------------------------------------------------------------------------------------------


function dump(filename)
{
    filename = filename || "./dump.js";
    var db = require('../omega').db;

    for(var dbName in db.databases)
    {
        console.log('Dumping database \'%s\'.', dbName);
        db.dump(dbName, filename);
    } // end for
} // end dump

function sync()
{
    var db = require('../omega').db;
    for(var dbName in db.databases)
    {
        console.log('Syncing database \'%s\'.', dbName);
        db.databases[dbName].sync();
    } // end for
} // end sync

function drop()
{
    var db = require('../omega').db;
    for(var dbName in db.databases)
    {
        console.log('Droping database \'%s\'.', dbName);
        db.databases[dbName].drop();
    } // end for
} // end drop

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    'dump': dump,
    'sync': sync,
    'drop': drop
}; // end exports

//----------------------------------------------------------------------------------------------------------------------