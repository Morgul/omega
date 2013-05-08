//----------------------------------------------------------------------------------------------------------------------
// Settings for the {{ app }} application.
//
// @module settings.js
//----------------------------------------------------------------------------------------------------------------------

var connect = require('connect');
var passport = require('passport');

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
    // Standard connect middleware
    connect.query(),
    connect.cookieParser(),
    connect.session({
        secret: secret,
        key: 'sid',
        cookie: { secure: true }
    }),

    // Authentication support
    passport.initialize(),
    passport.session()
];

//----------------------------------------------------------------------------------------------------------------------
