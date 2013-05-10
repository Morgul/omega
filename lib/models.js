//----------------------------------------------------------------------------------------------------------------------
// Brief Description of models.
//
// @module models
//----------------------------------------------------------------------------------------------------------------------

var Sequelize = require("sequelize")

var logger = require('./logging').getLogger('app.db');

//----------------------------------------------------------------------------------------------------------------------

function ModelManager()
{
    this.databases = {};
    this.models = {};

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
} // end ModelManager

ModelManager.prototype.createDbConnection = function(name, database, username, password, options)
{
    this.databases[name] = new Sequelize(databse, username, password, options)
}; // end createDbConnection

ModelManager.prototype.define = function(db, modelName, modelOpts)
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

    this.models[db][modelName] = conn.define(modelName, modelOpts);
}; // end define

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    ModelMan: ModelManager
}; // end exports

//----------------------------------------------------------------------------------------------------------------------