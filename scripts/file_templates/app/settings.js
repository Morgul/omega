//----------------------------------------------------------------------------------------------------------------------
// Settings for the {{ app }} application.
//
// @module settings.js
//----------------------------------------------------------------------------------------------------------------------

var connect = require('connect');
var passport = require('passport');

//----------------------------------------------------------------------------------------------------------------------

// Enables omega-wf debugging helpers. Disable this for production!
DEBUG = true;

// Server settings
listenAddress = "0.0.0.0";
listenPort = 8080;

// Used for secure sessions. This should be unique per omega-wf application.
secret = "{{ secret }}";

// Middleware
middleware = [
    // Standard connect middleware
    connect.query(),

    // Not required, but recommended for auth
    connect.cookieParser(secret),
    connect.session({
        secret: secret,
        key: 'sid'
    })
];

//----------------------------------------------------------------------------------------------------------------------
