'use strict';

var rule = require('./template-location'),
    RuleTester = require('eslint').RuleTester;

var ruleTester = new RuleTester();
ruleTester.run('bd-template-location', rule, {
    valid: [
        'fs.readFileSync()'
    ],

    invalid: [
        {
            code: 'module.exports = function () { fs.readFileSync(); }',
            errors: [ { message: 'readFileSync calls should live outside of the function assigned to module.exports' } ]
        }
    ]
});