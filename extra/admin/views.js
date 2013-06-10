//----------------------------------------------------------------------------------------------------------------------
// Views for the admin section
//
// @module views.js
//----------------------------------------------------------------------------------------------------------------------

var path = require('path');
var async = require('async');
var render = require('../../util/swig').render;

var logger = require('../../lib/logging').getLogger('extra.admin');

//----------------------------------------------------------------------------------------------------------------------

function index(req, resp)
{
    var app = require('../../omega').app;
    var url = app.config.omegaAdminUrl || '/admin';

    render(resp, "../extra/admin/templates/index.html", {
        admin_static: url + "/static",
        admin_url: url
    }, true);
} // end index

function models(req, resp)
{
    var db = require('../../omega').db;

    resp.writeHead(200, { 'Content-Type': 'application/json' });

    //TODO: Handle more than just default?
    var models = db.models['default'] || {};
    var modelDefs = [];
    Object.keys(models).forEach(function(key)
    {
        var model = models[key];

        var associations = [];
        Object.keys(model.associations).forEach(function(aKey)
        {
            var association = model.associations[aKey];

            associations.push({
                name: aKey,
                as: association.options.as,
                accessors: association.accessors,
                target: {
                    name: association.target.name
                },
                associationType: association.associationType,
                identifier: association.identifier
            });
        });

        modelDefs.push({
            name: model.name,
            fields: model.rawAttributes,
            options: model.options,
            relations: associations
        });
    });

    resp.end(JSON.stringify(modelDefs));
} // end index

function instance(req, resp)
{
    var modelName = req.params.model;
    var id = req.params.id;

    var db = require('../../omega').db;
    db.model(modelName).find(id)
        .success(function(model)
        {
            if(model != null)
            {
                // Pull HasMany associations
                Object.keys(db.model(modelName).associations).forEach(function(aKey)
                {
                    var association = db.model(modelName).associations[aKey];

                    if(association.associationType == 'HasMany')
                    {
                        console.log('Dude!');
                    } // end if
                });

                resp.writeHead(200, { 'Content-Type': 'application/json' });
                resp.end(JSON.stringify({ model: model, options: model.daoFactory.options }));
            }
            else
            {
                resp.writeHead(404, { 'Content-Type': 'application/json' });
                resp.end("Instance not found.");
                logger.warn('Instance \"%s\" of model \"%s\" not found.', id, modelName);
            } // end if
        })
        .error(function(error)
        {
            resp.writeHead(500, { 'Content-Type': 'application/json' });
            resp.end(JSON.stringify({error: error}));
            logger.error("Error occurred: \n%s", error);
        });
} // end instance

function all_instances(req, resp)
{
    var modelName = req.params.model;

    var db = require('../../omega').db;
    db.model(modelName).findAll()
        .success(function(models)
        {
            if(models != null)
            {
                var newModels = [];
                async.each(models, function(model, iterCallback)
                {
                    var associations = {};
                    var getters = [];

                    // Pull HasMany associations
                    Object.keys(db.model(modelName).associations).forEach(function(aKey)
                    {
                        var association = db.model(modelName).associations[aKey];

                        if(association.associationType == 'HasMany')
                        {
                            getters.push(function(callback)
                            {
                                model[association.accessors.get]().success(function(data)
                                {
                                    var ids = [];

                                    data.forEach(function(inst)
                                    {
                                        ids.push(inst.id);
                                    });

                                    associations[aKey] = ids;
                                    callback();
                                });
                            });
                        } // end if
                    });

                    async.parallel(getters, function()
                    {
                        newModels.push({model: model, associations: associations, options: model.daoFactory.options});
                        iterCallback();
                    });
                }, function()
                {
                    resp.writeHead(200, { 'Content-Type': 'application/json' });
                    resp.end(JSON.stringify(newModels));
                });
            }
            else
            {
                resp.writeHead(404, { 'Content-Type': 'application/json' });
                resp.end("No instances od model \"" + modelName + "\" found.");
                logger.warn('No instances of model \"%s\" found.', modelName);
            } // end if
        })
        .error(function(error)
        {
            resp.writeHead(500, { 'Content-Type': 'application/json' });
            resp.end(JSON.stringify({error: error}));
            logger.error("Error occurred: \n%s", error);
        });
} // end all_instances

function save(req, resp)
{
    var post = req.body;
    var instance = post.model;
    var associations = post.associations || {};

    var modelName = req.params.model;
    var modelID = req.params.id;

    var db = require('../../omega').db;

    if(modelID)
    {
        db.model(modelName).findOrCreate({id: modelID})
            .success(function(model)
            {
                model.updateAttributes(instance)
                    .success(function()
                    {
                        // Update associations here.
                        var associationValues = [];

                        async.each(Object.keys(associations), function(aKey, callback)
                        {
                            async.each(associations[aKey], function(modelID, iCallback)
                            {
                                db.model(model.daoFactory.associations[aKey].target.name).find(modelID).success(function(aModel)
                                {
                                    associationValues.push(aModel);
                                    iCallback();
                                });
                            }, function()
                            {
                                model[model.daoFactory.associations[aKey].accessors.set](associationValues)
                                    .success(function(){ callback(); })
                                    .error(function(error){ callback(error); });
                            });
                        }, function()
                        {
                            logger.info('Successfully updated model.');
                            resp.writeHead(200, { 'Content-Type': 'application/json' });
                            resp.end(JSON.stringify({ model: model, options: model.daoFactory.options }));
                        });
                    })
                    .error(function(error)
                    {
                        logger.error("Error saving model: \n%s", error);
                        resp.writeHead(500);
                        resp.end('Error saving model: ' + error.toString());
                    });
            })
            .error(function(error)
            {
                logger.error("Error finding model (for save): \n%s", error);
                resp.writeHead(500);
                resp.end('Error finding model (for save): ' + error.toString());
            });
    }
    else
    {
        db.model(modelName).create(instance)
            .success(function(model)
            {
                logger.info('Successfully created model.');
                resp.writeHead(200, { 'Content-Type': 'application/json' });
                resp.end(JSON.stringify({ model: model, options: model.daoFactory.options }));
            })
            .error(function(error)
            {
                logger.error("Error creating model: \n%s", error);
                resp.writeHead(500);
                resp.end('Error creating model: ' + error.toString());
            });
    } // end if
} // end save

function remove(req, resp)
{
    var modelName = req.params.model;
    var modelID = req.params.id;

    var db = require('../../omega').db;
    db.model(modelName).find(modelID)
        .success(function(model)
        {
            model.destroy()
                .success(function()
                {
                    resp.end();
                })
                .error(function(error)
                {
                    logger.error("Error deleting model: \n%s", error);
                    resp.writeHead(500);
                    resp.end('Error deleting model: ' + error.toString());
                });
        })
        .error(function(error)
        {
            logger.error("Error deleting model: \n%s", error);
            resp.writeHead(500);
            resp.end('Error deleting model: ' + error.toString());
        });
}

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    index: index,
    models: models,
    instance: instance,
    all_instances: all_instances,
    save: save,
    delete: remove
}; // end exports

//----------------------------------------------------------------------------------------------------------------------