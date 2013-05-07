// ---------------------------------------------------------------------------------------------------------------------
// An example http module, implementing a simple new service.
//
// @module news.js
// ---------------------------------------------------------------------------------------------------------------------

var utils = require('omega-node').utils;

var swig = require('swig');

swig.init({
    cache: false,
    root: './templates'
});

// ---------------------------------------------------------------------------------------------------------------------

function index(request, response)
{
    var items = [
        {
            title: "Some item?",
            author: "Bob Jones"
        },
        {
            title: "Moar News!",
            author: "Bob Jones"
        },
        {
            title: "They see me tollin'...",
            author: "Bob Jones"
        },
        {
            title: "They hating...",
            author: "Bob Jones"
        }
    ];

    utils.render(response, "index.html", {
        news: items
    })

} // end index

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
    index: index
}; // end exports

// ---------------------------------------------------------------------------------------------------------------------