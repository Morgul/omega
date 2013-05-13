//----------------------------------------------------------------------------------------------------------------------
// Brief Description of models.
//
// @module database.js
//----------------------------------------------------------------------------------------------------------------------
var path = require('path');
var Sequelize = require("sequelize")

var logger = require('./logging').getLogger('app.db');

var dbManInstance;

//----------------------------------------------------------------------------------------------------------------------

function DatabaseManager(config)
{
    this.databases = {};
    this.models = {};
    this.config = config || {};

    // Load configuration
    this.loadConfig();

    // Types
    this.STRING = Sequelize.STRING;     // VARCHAR(255)
    this.TEXT = Sequelize.TEXT;         // TEXT
    this.INTEGER = Sequelize.INTEGER;   // INTEGER
    this.BIGINT = Sequelize.BIGINT;     // BIGINT
    this.DATE = Sequelize.DATE;         // DATETIME
    this.BOOLEAN = Sequelize.BOOLEAN;   // TINYINT(1)
    this.FLOAT = Sequelize.FLOAT;       // FLOAT

    this.ENUM = Sequelize.ENUM;         // An ENUM with allowed values 'value 1' and 'value 2'
    this.DECIMAL = Sequelize.DECIMAL;   // DECIMAL(10,2)
    this.ARRAY = Sequelize.ARRAY;       // Defines an array. PostgreSQL only.
} // end DatabaseManager

DatabaseManager.prototype.loadConfig = function()
{
    for(var db in this.config.databases)
    {
        var dbDef = this.config.databases[db];
        var database = dbDef.database;
        var username = dbDef.username;
        var password = dbDef.password;
        var options = dbDef.options || {logging: false};
        options.dialect = dbDef.engine;

        if(options.dialect == 'sqlite')
        {
            options.storage = path.resolve(database);
            database = '';
        } // end if

        this.createDbConnection(db, database, username, password, options);
    } // end for
}; // end loadConfig

DatabaseManager.prototype.createDbConnection = function(name, database, username, password, options)
{
    this.databases[name] = new Sequelize(database, username, password, options)
}; // end createDbConnection

DatabaseManager.prototype.model = function(db, modelName)
{
    if(!modelName)
    {
        modelName = db;
        db = 'default';
    } // end if

    try
    {
        var model = this.models[db][modelName];

        if(!model)
        {
            logger.error('Unable to find requested model \"%s\" on database \"%s\".', modelName, db);
        } // end if

        return model;
    }
    catch(error)
    {
        logger.error("Encoutered error when attempting to look up model: %s", error);
    } // try/catch
};

DatabaseManager.prototype.define = function(db, modelName, modelOpts)
{
    var args = Array.prototype.slice.call(arguments, 0);

    if(args.length == 2)
    {
        modelOpts = modelName;
        modelName = db;
        db = 'default';
    } // end if

    var conn = this.databases[db];

    if(!conn)
    {
        logger.error('Attempting to define a model on unknown database \"%s\"', db);
    } // end if

    if(!this.models[db])
    {
        this.models[db] = {};
    } // end if

    // Create the model, and save it.
    var model = conn.define(modelName, modelOpts);
    this.models[db][modelName] = model;

    return model;
}; // end define


//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    DbMan: dbManInstance,
    createDbMan: function(config)
    {
        dbManInstance = new DatabaseManager(config);
        return dbManInstance;
    }
}; // end exports

//----------------------------------------------------------------------------------------------------------------------