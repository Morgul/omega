//----------------------------------------------------------------------------------------------------------------------
// Authentication wrapper for passport.
//
// @module auth.js
//----------------------------------------------------------------------------------------------------------------------

var connect = require('connect');
var passport = require('passport');

//----------------------------------------------------------------------------------------------------------------------

function AuthManager()
{
    this.passport = passport;
} // end AuthManager

AuthManager.prototype.use = function()
{
    this.passport.use.apply(this.passport, arguments);
}; // end use

AuthManager.prototype.serializeUser = function(userFunc)
{
    userFunc = userFunc || function(user, done){ done(null, user); };
    this.passport.serializeUser(userFunc);
}; // end serializeUser

AuthManager.prototype.deserializeUser = function(userFunc)
{
    userFunc = userFunc || function(user, done){ done(null, user); };
    this.passport.deserializeUser(userFunc)
}; // end deserializeUser

AuthManager.prototype.authenticate = function(stategy, options)
{
    if(typeof options == 'function')
    {
        return function(request, response)
        {
            this.passport.authenticate(stategy, options)(request, response);
        }.bind(this);
    } // end if

    return this.passport.authenticate(stategy, options);
}; // end authenticate

// This is a class method
AuthManager.loadMiddleware = function(connectApp)
{
    return connectApp.use(connect.bodyParser())
        .use(passport.initialize())
        .use(passport.session());
}; // end middleware

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    Auth: AuthManager
}; // end exports

//----------------------------------------------------------------------------------------------------------------------