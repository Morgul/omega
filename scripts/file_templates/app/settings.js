//----------------------------------------------------------------------------------------------------------------------
// Settings for the {{ app }} application.
//
// @module settings.js
//----------------------------------------------------------------------------------------------------------------------

var connect = require('connect');

//----------------------------------------------------------------------------------------------------------------------

// Enables omega-wf debugging helpers. Disable this for production!
DEBUG = true;

// Omega will send email to the following addresses whenever an error occurs.
admins = [
    //["Your Name", "your.name@example.com"]
];

// Server settings
listenAddress = "0.0.0.0";
listenPort = 8080;

// Uncomment this line to control the url that omega serves it's static files at.
//omegaStaticUrl = '/omega';

// Used for secure sessions. This should be unique per omega-wf application.
secret = "{{ secret }}";

// Uncomment to setup/configure databases
//databases = {
//    default: {
//        engine: 'sqlite',
//        database: './{{ app }}.db'
//    }
//};

// Uncomment to enable the admin section
//omegaAdminUrl = '/admin';
//useOmegaAdmin = true;

// Connect Middleware
middleware = [
    // Standard connect middleware
    connect.query()
];

//----------------------------------------------------------------------------------------------------------------------
