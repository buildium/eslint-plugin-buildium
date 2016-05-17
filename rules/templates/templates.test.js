'use strict';

var rule = require('./templates'),
    RuleTester = require('eslint').RuleTester;

var ruleTester = new RuleTester();
ruleTester.run('templates', rule, {
    valid: [
        {
            code: '`5`',
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: '`5 + ${x}`',
            parserOptions: { ecmaVersion: 6 }
        }
    ],

    invalid: [
        {
            code: 'test`x`',
            errors: [ { message: 'Transpiled tagged template literals are slow in some browsers, so we should avoid them for now' } ],
            parserOptions: { ecmaVersion: 6 }
        }
    ]
});