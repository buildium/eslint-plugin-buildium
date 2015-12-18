'use strict';

var rule = require('./func-names'),
    RuleTester = require('eslint').RuleTester;

var ruleTester = new RuleTester();
ruleTester.run('bd-func-names', rule, {
    valid: [
        'function funcName() { console.log("Nope"); }',
        'var test = function funcName() { console.log("Nope"); }',
        'test(function() {})'
    ],

    invalid: [
        {
            code: 'var test = function () { console.log("Nope"); }',
            errors: [ { message: 'Missing function expression name.' } ]
        },
        {
            code: 'var test = { thing: function () { console.log("Nope"); } }',
            errors: [ { message: 'Missing function expression name.' } ]
        }
    ]
});