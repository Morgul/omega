//----------------------------------------------------------------------------------------------------------------------
// Views for the admin section
//
// @module views.js
//----------------------------------------------------------------------------------------------------------------------

var path = require('path');
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
    var models = db.models['default'];
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
            relations: associations
        });
    });

    resp.end(JSON.stringify(modelDefs));
} // end index

function instance(req, resp)
{
    var db = require('../../omega').db;

    var modelName = req.params.model;
    var id = req.params.id;

    db.model(modelName).find(id)
        .success(function(model)
        {
            if(model != null)
            {
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
    var db = require('../../omega').db;

    var modelName = req.params.model;

    db.model(modelName).findAll()
        .success(function(models)
        {
            if(models != null)
            {
                var newModels = [];
                models.forEach(function(model)
                {
                    newModels.push({model: model, options: model.daoFactory.options});
                });

                resp.writeHead(200, { 'Content-Type': 'application/json' });
                resp.end(JSON.stringify(newModels));
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
    var modelName = req.params.model;
    var modelID = req.params.id;

    var db = require('../../omega').db;
    db.model(modelName).findOrCreate({id: modelID})
        .success(function(model)
        {
            model.updateAttributes(post)
                .success(function()
                {
                    logger.info('Successfully updated model.');
                    resp.end();
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
            logger.error("Error finding model: \n%s", error);
            resp.writeHead(500);
            resp.end('Error finding model: ' + error.toString());
        });
} // end save

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    index: index,
    models: models,
    instance: instance,
    all_instances: all_instances,
    save: save
}; // end exports

//----------------------------------------------------------------------------------------------------------------------