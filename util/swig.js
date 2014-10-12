// ---------------------------------------------------------------------------------------------------------------------
// A convenience function for rendering swig templates.
//
// @module swig.js
// ---------------------------------------------------------------------------------------------------------------------

var path = require('path');

var swig = require('swig');

// This might break people who try and use swig, but it's so old, at this point, it's better than crashing.
swig.init({
    root: path.join(__dirname, '../templates')
});

// ---------------------------------------------------------------------------------------------------------------------

function render(response, template, context, internal)
{
    var app = require('../omega').app;

    // If we're rendering an internal template, we have to turn our template paths into absolute paths.
    if(internal)
    {
        template = omegaPath(template);
    } // end if

    // Check to see if the user has overridden 'DEBUG'. If not, add the app.config.DEBUG flag.
    if(!context['DEBUG'])
    {
        context['DEBUG'] = app.config.DEBUG;
    } // end if

    var tpl = swig.compileFile(template);
    response.end(tpl.render(context));
} // end render

function omegaPath(template)
{
    return path.join(__dirname, '../templates', template);
} // end absPath

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
    render: render,
    omegaPath: omegaPath
};

// ---------------------------------------------------------------------------------------------------------------------