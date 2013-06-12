//----------------------------------------------------------------------------------------------------------------------
// Tests for the app module.
//
// @module app-test.js
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------

var vows = require('vows');
var assert = require('assert');

var socketio = require('socket.io');

var Router = require('../lib/router').Router;
var App = require('../lib/app').App;

//----------------------------------------------------------------------------------------------------------------------

vows.describe("App")
    .addBatch({
        'The `app.js` module':
        {
            'has an `App` object':
            {
                topic: App,
                'that can be instantiated': function (topic)
                {
                    var inst = new App();

                    assert.isDefined(inst);
                },
                'that has a router': function(topic)
                {
                    var inst = new App();

                    assert.instanceOf(inst.router, Router);
                },
                'that exposes socket.io': function(topic)
                {
                    var inst = new App();

                    assert.isDefined(inst.sockets);
                },
                'that exposes socket.io namespaces': function(topic)
                {
                    var inst = new App();

                    assert.isDefined(inst.channel);
                },
                'that has a listen function': function(topic)
                {
                    var inst = new App();

                    assert.isDefined(inst.listen);
                }
            }
        }
    })
    .export(module);
//----------------------------------------------------------------------------------------------------------------------