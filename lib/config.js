//----------------------------------------------------------------------------------------------------------------------
// Configuration manager for omega application configuration.
//
// @module config.js
//----------------------------------------------------------------------------------------------------------------------

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var logger = require('./logging').getLogger('app.config');

//----------------------------------------------------------------------------------------------------------------------

var mainDir = '';
try
{
    mainDir = path.dirname(require.main.filename);
}
catch(err) { } // Ignore exceptions. (which happen if you're requiring this from an interactive session)

//----------------------------------------------------------------------------------------------------------------------

function ConfigurationManager()
{
    this.config = {};
} // end ConfigurationManager

ConfigurationManager.prototype.load = function(filename)
{
    filename = filename || path.join(mainDir, 'settings.js');

    try
    {
        logger.debug("Loading config file \"%s\"...", filename);

        // This needs to be synchronous, so that we populate the global config BEFORE anyone tries to read it!
        var settingsFile = fs.readFileSync(filename, 'utf8');

        var vmContext = vm.createContext();
        vm.runInContext(settingsFile, vmContext, filename);

        this.config = vmContext;
    }
    catch(ex)
    {
        logger.error("Exception while loading configuration from \"%s\":\n%s", filename, ex.stack);
    } // end try/catch
}; // end load

ConfigurationManager.prototype.set = function(key, value)
{
    try
    {
        this._config[key] = value;
    }
    catch(ex)
    {
        logger.error("Exception while setting configuration key \"%s\":\n%s", key, ex.stack);
    } // end try/catch
}; // end set

ConfigurationManager.prototype.get = function(key, defaultValue)
{
    try
    {
        return this._config[key] || defaultValue;
    }
    catch(ex)
    {
        logger.error("Exception while getting configuration key \"%s\":\n%s", key, ex.stack);
    } // end try/catch
}; // end set

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    Config: ConfigurationManager
}; // end exports

//----------------------------------------------------------------------------------------------------------------------