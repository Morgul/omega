//----------------------------------------------------------------------------------------------------------------------
// Brief Description of models.
//
// @module database.js
//----------------------------------------------------------------------------------------------------------------------
var fs = require('fs');
var path = require('path');
var async = require('async');
var Sequelize = require("sequelize")

var logger = require('./logging').getLogger('app.db');

var dbManInstance;

//----------------------------------------------------------------------------------------------------------------------

function DatabaseManager(config)
{
    this.databases = {};
    this.models = {};
    this.config = config || {};

    this._fieldIdx = 0;

    // Load configuration
    this.loadConfig();
} // end DatabaseManager

DatabaseManager.prototype = {
    get String()
    {
        return this.buildFieldType(Sequelize.STRING);
    },
    get Text()
    {
        return this.buildFieldType(Sequelize.TEXT);
    },
    get Integer()
    {
        return this.buildFieldType(Sequelize.INTEGER);
    },
    get BigInt()
    {
        return this.buildFieldType(Sequelize.BIGINT);
    },
    get Datetime()
    {
        return this.buildFieldType(Sequelize.DATE);
    },
    get Boolean()
    {
        return this.buildFieldType(Sequelize.BOOLEAN);
    },
    get Float()
    {
        return this.buildFieldType(Sequelize.FLOAT);
    },
    get Choice()
    {
        return this.buildFieldType(Sequelize.ENUM);
    },
    get Decimal()
    {
        return this.buildFieldType(Sequelize.DECIMAL);
    },
    get Array()
    {
        return this.buildFieldType(Sequelize.ARRAY);
    },
    get Slug()
    {
        return this.buildFieldType(Sequelize.STRING, { subType: 'slug' });
    },
    get File()
    {
        return this.buildFieldType(Sequelize.TEXT, { subType: 'file', uploadPath: './uploads' });
    },
    get Image()
    {
        return this.buildFieldType(Sequelize.TEXT, { subType: 'image', uploadPath: './uploads' });
    }
}; // end DatabaseManager.prototype

DatabaseManager.prototype.buildFieldType = function(type, options)
{
    this._fieldIdx += 1;

    options = options || {};
    options.fieldIndex = this._fieldIdx;

    return function(fieldOptions)
    {
        var fieldDef = { type: type };
        fieldOptions = fieldOptions || {};

        // Handle special fields
        if(type == Sequelize.ENUM)
        {
            var choices = options.choices || [];
            fieldDef = { type: type.apply(this, choices) };
        }

        if(type == Sequelize.DECIMAL)
        {
            var precision = options.precision;
            var scale = options.scale;

            fieldDef = { type: type(precision, scale) };
        }

        if(type == Sequelize.ARRAY)
        {
            var of = options.of || Sequelize.STRING;
            fieldDef = { type: type(of) };
        }

        // Add the default options from the field def.
        Object.keys(options).forEach(function(key)
        {
            fieldDef[key] = options[key];
        });

        // Add the user specified options.
        Object.keys(fieldOptions).forEach(function(key)
        {
            fieldDef[key] = fieldOptions[key];
        });

        return fieldDef;
    }; // end function
}; // end buildFieldType

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

DatabaseManager.prototype.define = function(db, modelName, modelDef, modelOpts)
{
    var args = Array.prototype.slice.call(arguments, 0);

    if(args.length < 4)
    {
        modelOpts = modelDef;
        modelDef = modelName;
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

    // Reset the field index
    this._fieldIdx = 0;

    // Create the model, and save it.
    var model = conn.define(modelName, modelDef, modelOpts);
    this.models[db][modelName] = model;

    return model;
}; // end define

DatabaseManager.prototype.dump = function(db, path)
{
    if(path == undefined)
    {
        path = db;
        db = 'default';
    } // end if

    var dump = {};
    async.each(Object.keys(this.models[db]), function(key, callback)
    {
        this.models[db][key].findAll().success(function(models)
        {
            dump[key] = models;
            callback();
        }).error(callback);
    }.bind(this), function(error)
    {
        if(error)
        {
            logger.error("Error looking up %s instances. \n%s", key, error);
            return;
        } // end if

        fs.writeFile(path, JSON.stringify(dump, null, 4), function(err)
        {
            if(err)
            {
                logger.error("Error writing dump file. \n%s", err);
            } // end if

            logger.info('Finished dumping %s', db);
        });
    });
}; // end dump

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