//----------------------------------------------------------------------------------------------------------------------
// Tests for the config-test.js module.
//
// @module config-test.js
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------

var fs = require('fs');
var crypto = require('crypto');

var vows = require('vows');
var assert = require('assert');

var Config = require('../lib/config').Config;

//----------------------------------------------------------------------------------------------------------------------

vows.describe("Config")
    .addBatch({
        'The ConfigurationManager': {
            'is a class that': {
                topic: function()
                {
                    // Build a temporary settings file.
                    var filename = 'foo'+crypto.randomBytes(4).readUInt32LE(0)+'bar';
                    fs.writeFileSync(filename, 'var foo = 12345; var bar = "hi";');

                    return [filename, new Config()];
                },
                'can load a config': function (topic) {
                    var filename = topic[0];
                    var config = topic[1];

                    assert.doesNotThrow(function()
                    {
                        config.load(filename);
                    }, Error);

                    assert.isDefined(config._config);
                    assert.equal(config._config.foo, 12345);
                    assert.equal(config._config.bar, "hi");
                },
                'can set a new key': function (topic) {
                    var filename = topic[0];
                    var config = topic[1];

                    config.set('bleh', "omg");

                    assert.equal(config._config.bleh, "omg");
                },
                'can update an existing key': function (topic) {
                    var filename = topic[0];
                    var config = topic[1];

                    config.set('bar', "omg");

                    assert.equal(config._config.bar, "omg");
                },
                'can get an existing key': function (topic) {
                    var filename = topic[0];
                    var config = topic[1];

                    assert.equal(config.get("foo"), 12345);
                },
                'can a default value for an nonexistent key': function (topic) {
                    var filename = topic[0];
                    var config = topic[1];

                    assert.equal(config.get("doesNotExist", "hi"), "hi");
                }
            }
        }
    })
    .export(module);
//----------------------------------------------------------------------------------------------------------------------