//----------------------------------------------------------------------------------------------------------------------
// Views for the admin section
//
// @module views.js
//----------------------------------------------------------------------------------------------------------------------

var path = require('path');
var render = require('../../util/swig').render;

//----------------------------------------------------------------------------------------------------------------------

function index(req, resp)
{
    var app = require('../../omega').app;
    var url = app.config.omegaAdminUrl || '/admin';

    render(resp, "../extra/admin/templates/index.html", {
        admin_static: url + "/static"
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

    console.log(modelDefs);

    resp.end(JSON.stringify(modelDefs));
} // end index

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    index: index,
    models: models
}; // end exports

//----------------------------------------------------------------------------------------------------------------------