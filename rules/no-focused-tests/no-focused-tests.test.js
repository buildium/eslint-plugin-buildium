'use strict';

var rule = require('./no-focused-tests'),
    RuleTester = require('eslint').RuleTester;

var ruleTester = new RuleTester();
ruleTester.run('no-focused-tests', rule, {
    valid: [
        'describe("something under test");',
        'it("should do a thing");'
    ],
    invalid: [
        {
            code: 'fdescribe("something under test");',
            errors: [ { message: 'Do not check in jasmine tests with the following: fdescribe, fit, iit, or ddescribe.' } ]
        },
        {
            code: 'ddescribe("something under test");',
            errors: [ { message: 'Do not check in jasmine tests with the following: fdescribe, fit, iit, or ddescribe.' } ]
        },
        {
            code: 'iit("should do a thing");',
            errors: [ { message: 'Do not check in jasmine tests with the following: fdescribe, fit, iit, or ddescribe.' } ]
        },
        {
            code: 'fit("should do a thing");',
            errors: [ { message: 'Do not check in jasmine tests with the following: fdescribe, fit, iit, or ddescribe.' } ]
        }
    ]
});