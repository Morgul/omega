// ---------------------------------------------------------------------------------------------------------------------
// A convenience function for rendering swig templates.
//
// @module swig.js
// ---------------------------------------------------------------------------------------------------------------------

var path = require('path');

var swig = require('swig');

// ---------------------------------------------------------------------------------------------------------------------

function render(response, template, context)
{
    response.end(swig.compileFile(template).render(context));
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