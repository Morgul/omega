#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var cli = require('commander');
var package = require('../package.json');
var smpltmpl = require('../util/smpltmpl');

var logger = require('../lib/logging').getLogger('omega-wf-admin.js');

//----------------------------------------------------------------------------------------------------------------------

var matchedCommand = false;

cli.version(package.version);

cli.command('startapp [APP]')
    .description('create a new omega-wf application named APP in the current directory.')
    .action(createApp);

cli.command('help')
    .description('display this help')
    .action(cli.help);

try
{
    cli.parse(process.argv);
}
catch(error)
{
    logger.error("Error parsing arguments: %s", error);
} // end try

if(!matchedCommand)
{
    cli.help();
} // end if

//----------------------------------------------------------------------------------------------------------------------
// Commands
//----------------------------------------------------------------------------------------------------------------------

function createApp(appName)
{
    matchedCommand = true;

    logger.info("Creating the %s omega-wf app...", appName);

    var appPath = path.join(process.cwd(), appName);
    var appTemplateDir = path.join(__dirname, 'file_templates', 'app');

    // Generate a random string for app's secret key.
    try
    {
        var secret = require('crypto').randomBytes(48).toString('hex');
    }
    catch(error)
    {
        logger.error("Error generating random bytes: %s", error);
    } // end try/catch

    var context = {
        app: appName,
        secret: secret
    }; // end context

    fs.mkdir(appPath, function(error)
    {
        if(error)
        {
            logger.error(error, "Error creating target directory %j: %s", appPath, error);
            return;
        } // end if

        // Move us into the project directory
        process.chdir(appPath);

        // Create the basic omega-wf project files.
        smpltmpl.templateFile('server.js', appTemplateDir, appPath, context);
        smpltmpl.templateFile('settings.js', appTemplateDir, appPath, context);
        smpltmpl.templateFile('package.json', appTemplateDir, appPath, context);
        smpltmpl.templateFile('README.md', appTemplateDir, appPath, context);

        logger.info("Successfully created %s application.", appName);
    });
} // end createApp

//----------------------------------------------------------------------------------------------------------------------