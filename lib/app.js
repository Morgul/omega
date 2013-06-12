// ---------------------------------------------------------------------------------------------------------------------
// Provides the application class for omega-wf apps.
//
// @module app.js
// ---------------------------------------------------------------------------------------------------------------------
var http = require('http');
var socketio = require('socket.io');
var path = require('path');
var fs = require('fs');

var connect = require('connect');
var redirect = require('connect-redirection');

var passportSocketIO = require("passport.socketio");

var Router = require('./router').Router;
var Config = require('./config').Config;
var Auth = require('./auth').Auth;
var logging = require('./logging');

//----------------------------------------------------------------------------------------------------------------------

var mainDir = '';
try
{
    mainDir = path.dirname(require.main.filename);
}
catch(err) { } // Ignore exceptions. (which happen if you're requiring this from an interactive session)

// ---------------------------------------------------------------------------------------------------------------------

function OmegaApp()
{
    this.initFunctions = [];
    this.initDone = false;
    this.mainFunc = this.run;
    this.name = "Omega Application";
    this.sessionStore = new connect.session.MemoryStore();

    // Expose logging
    this.logger = logging.getLogger('app');

    // Create a router for this application
    this.router = new Router();

    // Create a configuration manager for this application
    this._configMan = new Config(this);

    if(fs.existsSync(path.join(mainDir, 'settings.js')))
    {
        this._configMan.load();
    } // end if

    //---------------------------------------------------------------------
    // Setup things dependant on configuration
    //---------------------------------------------------------------------

    // Get the url to serve omega's static files at
    this.omegaStaticUrl = this.config.omegaStaticUrl || "/omega";

    // Add omega static files.
    this.router.add({url: this.omegaStaticUrl + "/*", path: path.join(__dirname, '../static')});

    // Should we enable the omega admin section?
    if(this.config.useOmegaAdmin)
    {
        this.adminInit = require('../extra/admin/admin').initialize;
    } // end if

    //---------------------------------------------------------------------
    // Setup http and socket.io
    //---------------------------------------------------------------------

    var middleware = this.config.middleware || [];
    var secret = this.config.secret || "WHYNOSECRET?";

    // Setup connect
    var _app = connect.apply(this, middleware).use(redirect());
    Auth.loadMiddleware(_app)
        .use(this.router.middleware())
        .use(function(request, response)
        {
            require('./40X_handler').handle404(request, response);
        })
        .use(function(error, request, response, next)
        {
            require('./50x_handler').handle500(request, response, error);
        });

    // Bind our connect app to http, and then to socket.io
    this._http_app = http.createServer(_app);
    this._io = socketio.listen(this._http_app, {log: false});

    // Expose the socket io object
    this.sockets = this._io.sockets;

    // Expose socket.io authentication support.
    this.sockets.enableAuth = function()
    {
        this.socketIOAuth(this._io, secret, this.sessionStore, this.logger);
    }.bind(this); // end enableAuth

    // Call any initialization requests that have come in since we started initialization.
    this.initFunctions.forEach(function(initFunc)
    {
        initFunc();
    });

    // And, we're done here.
    this.initDone = true;
} // end App constructor

OmegaApp.prototype = {
    get config()
    {
        return this._configMan._config;
    } // end get
}; // end prototype

OmegaApp.prototype.channel = function(channel)
{
    return this._io.of(channel);
}; // end channel

OmegaApp.prototype.socketIOAuth = function(sio, secret, sessionStore, logger)
{
    sio.set("authorization", passportSocketIO.authorize({
        passport: require('passport'),
        key:    'sid',
        secret: secret,
        store:   sessionStore,
        fail: function(data, accept)
        {
            logger.debug('Denying socket.io connection:', data);
            accept(null, false);
        },
        success: function(data, accept) {
            logger.debug('Allowing socket.io connection.');
            accept(null, true);
        }
    }));
}; // end socketIOAuth

OmegaApp.prototype.loadConfig = function(filename)
{
    this._configMan.load(filename);
}; // end loadConfig

OmegaApp.prototype.setName = function(name)
{
    this.name = name;
}; // end name

OmegaApp.prototype.init = function(initFunc)
{
    if(this.initDone)
    {
        initFunc();
    }
    else
    {
        this.initFunctions.push(initFunc);
    } // end if
}; // end init

OmegaApp.prototype.setMainFunc = function(func)
{
    this.logger.debug("Setting a new main function.");
    this.mainFunc = func;
}; // end setMainFunc

OmegaApp.prototype.listen = function()
{
    this.logger.debug("Calling the app's main function.");
    this.mainFunc();
}; // end listen

OmegaApp.prototype.run = function()
{
    var host = this.config.listenHost || "0.0.0.0";
    var port = this.config.listenPort || 8080;

    this._http_app.listen(port, host);

    if(this.adminInit)
    {
        this.adminInit();
    } // end if

    this.logger.info("%s listening on %s:%s", this.name, host, port);
}; // end listen

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
    App: OmegaApp
}; // end exports

// ---------------------------------------------------------------------------------------------------------------------