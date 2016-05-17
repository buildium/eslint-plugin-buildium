'use strict';

var rule = require('./arrow-functions'),
    RuleTester = require('eslint').RuleTester;

var ruleTester = new RuleTester();
ruleTester.run('arrow-functions', rule, {
    valid: [
        {
            code: 'test((x) => x + 1)',
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: 'test((x) => { return x + 1; })',
            parserOptions: { ecmaVersion: 6 }
        }
    ],

    invalid: [
        {
            code: 'x => x + 1',
            errors: [ { message: 'Arrow functions may only be used as callbacks' } ],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: 'var test = { thing: () => { console.log("Nope"); } }',
            errors: [ { message: 'Arrow functions may only be used as callbacks' } ],
            parserOptions: { ecmaVersion: 6 }
        }
    ]
});