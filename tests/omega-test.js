//----------------------------------------------------------------------------------------------------------------------
// Tests for the omega module.
//
// @module omega-test.js
//----------------------------------------------------------------------------------------------------------------------

var vows = require('vows');
var assert = require('assert');

var omega = require('../omega');

//----------------------------------------------------------------------------------------------------------------------

vows.describe("Omega")
    .addBatch({
        'The omega module':
        {
            'has an `app` propety':
            {
                topic: omega.app,
                'that is defined': function(topic)
                {
                    assert.isDefined(topic);
                },
                'that is an instance of OmegaApp': function(topic)
                {
                    assert.instanceOf(topic, require('../lib/app').App);
                }
            }
        }
    })
    .export(module);

//----------------------------------------------------------------------------------------------------------------------