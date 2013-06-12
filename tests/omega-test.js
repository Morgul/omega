//----------------------------------------------------------------------------------------------------------------------
// Tests for the omega-wf module.
//
// @module omega-wf-test.js
//----------------------------------------------------------------------------------------------------------------------

var vows = require('vows');
var assert = require('assert');

var omega = require('../omega');

//----------------------------------------------------------------------------------------------------------------------

vows.describe("omega-wf")
    .addBatch({
        'The `omega-wf.js` module':
        {
            'has an `app` property':
            {
                topic: omega.app,
                'that is defined': function(topic)
                {
                    assert.isDefined(topic);
                },
                'that is an instance of omegaApp': function(topic)
                {
                    assert.instanceOf(topic, require('../lib/app').App);
                }
            }
        }
    })
    .export(module);

//----------------------------------------------------------------------------------------------------------------------