//----------------------------------------------------------------------------------------------------------------------
// Settings for the {{ app }} application.
//
// @module settings.js
//----------------------------------------------------------------------------------------------------------------------

var connect = require('connect');

//----------------------------------------------------------------------------------------------------------------------

// Enables omega debugging helpers. Disable this for production!
DEBUG = true;

// Server settings
listenAddress = "0.0.0.0";
listenPort = 8080;

// Used for secure sessions. This should be unique per omega application.
secret = "{{ secret }}";

// Middleware
middleware = [
    // Put connect-compatible middleware here.
    // connect.query(),
    // some-other-middleware()
];

//----------------------------------------------------------------------------------------------------------------------
