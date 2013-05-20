//----------------------------------------------------------------------------------------------------------------------
// Helpers for working with sequelize.
//
// @module sequelize.js
//----------------------------------------------------------------------------------------------------------------------

var path = require('path');

//----------------------------------------------------------------------------------------------------------------------


function dump(manager, filename)
{
    //FIXME: We can't require them to always put the models in the same place!
    require(path.resolve('./models'));

    filename = filename || "./dump.js";

    for(var dbName in manager.databases)
    {
        console.log('Dumping database \'%s\'.', dbName);
        manager.dump(dbName, filename);
    } // end for
} // end dump

function sync(manager)
{
    //FIXME: We can't require them to always put the models in the same place!
    require(path.resolve('./models'));

    for(var dbName in manager.databases)
    {
        console.log('Syncing database \'%s\'.', dbName);
        manager.databases[dbName].sync();
    } // end for
} // end sync

function drop(manager)
{
    //FIXME: We can't require them to always put the models in the same place!
    require(path.resolve('./models'));

    for(var dbName in manager.databases)
    {
        console.log('Droping database \'%s\'.', dbName);
        manager.databases[dbName].drop();
    } // end for
} // end drop

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    'dump': dump,
    'sync': sync,
    'drop': drop
}; // end exports

//----------------------------------------------------------------------------------------------------------------------