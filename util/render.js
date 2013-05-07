// ---------------------------------------------------------------------------------------------------------------------
// A convenience function for rendering swig templates.
//
// @module render.js
// ---------------------------------------------------------------------------------------------------------------------

var swig = require('swig');

module.exports = function render(response, template, context)
{
    response.end(swig.compileFile(template).render(context));
};

// ---------------------------------------------------------------------------------------------------------------------