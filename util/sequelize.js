//----------------------------------------------------------------------------------------------------------------------
// Helpers for working with sequelize.
//
// @module sequelize.js
//----------------------------------------------------------------------------------------------------------------------

function sync(manager)
{
    for(var dbName in manager.databases)
    {
        console.log('Syncing database \'%s\'.', dbName);
        manager.databases[dbName].sync();
    } // end for
} // end sync

function drop(manager)
{
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