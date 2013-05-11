//----------------------------------------------------------------------------------------------------------------------
// Helpers for working with sequelize.
//
// @module sequelize.js
//----------------------------------------------------------------------------------------------------------------------

var path = require('path');


//----------------------------------------------------------------------------------------------------------------------


function sync(manager)
{
    require(path.resolve('./models'));

    for(var dbName in manager.databases)
    {
        console.log('Syncing database \'%s\'.', dbName);
        manager.databases[dbName].sync();
    } // end for
} // end sync

function drop(manager)
{
    require(path.resolve('./models'));

    for(var dbName in manager.databases)
    {
        console.log('Droping database \'%s\'.', dbName);
        manager.databases[dbName].drop();
    } // end for
} // end drop

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    'sync': sync,
    'drop': drop
}; // end exports

//----------------------------------------------------------------------------------------------------------------------