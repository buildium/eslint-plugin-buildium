'use strict';

var message = 'message',
    rule = require('./imports')(/thing/i, message),
    RuleTester = require('eslint').RuleTester;

var ruleTester = new RuleTester();
ruleTester.run('bd-imports-thing', rule, {
    valid: [
        'require()',
        'require("fake")',
        'require("thing", "two")',
        'require("two", "thing")',
        'test.require("thing")'
    ],

    invalid: [
        {
            code: 'require("Thing/other")',
            errors: [ { message: message } ]
        }
    ]
});