//----------------------------------------------------------------------------------------------------------------------
// Basic Django-style Template Rendering
//
// @module smpltmpl
//----------------------------------------------------------------------------------------------------------------------

var fs = require('fs');
var path = require('path');
var util = require('util');

var XRegExp = require('xregexp').XRegExp;

// --------------------------------------------------------------------------------------------------------------------

var templatePattern = XRegExp("\\{\\{\\s*(?<varname>[a-zA-Z0-9_]+)\\s*\\}\\}", 'g');

// Perform basic Django-style template variable replacement.
// (replaces `{{ varname }}` with the value of `context[varname]`)
function template(template, context)
{
    function templateReplacement(matched, varname)
    {
        return context[varname];
    } // end templateReplacement

    return XRegExp.replace(template, templatePattern, templateReplacement);
} // end template

function writeTemplateResult(templateFilename, context, targetFilename, onWriteFinished)
{
    fs.readFile(templateFilename,
        function onReadFileFinished(error, templateStr)
        {
            if(error)
            {
                throw new Error(util.format("Error reading template file %j: %s: %s",
                    templateFilename, error.name, error.message));
            } // end if

            fs.writeFile(targetFilename,
                template(templateStr, context),
                function onWriteFileFinished(err)
                {
                    if(error)
                    {
                        throw Error(util.format("Error writing target file %j: %s: %s",
                            targetFilename, error.name, error.message));
                    } // end if

                    if(onWriteFinished)
                    {
                        onWriteFinished(targetFilename)
                    } // end if
                });
        });
} // end writeTemplateResult

function templateFile(filename, templateDir, targetDir, context, onWriteFinished)
{
    var targetFilename = path.join(targetDir, filename);
    var templateFilename = path.join(templateDir, filename);

    writeTemplateResult(templateFilename, context, targetFilename, onWriteFinished);
} // end templateFile

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    'template': template,
    'writeTemplateResult': writeTemplateResult,
    'templateFile': templateFile
};

//----------------------------------------------------------------------------------------------------------------------