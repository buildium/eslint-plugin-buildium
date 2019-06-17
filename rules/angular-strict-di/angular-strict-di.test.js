const { RuleTester } = require('eslint');
const rule = require('./angular-strict-di');

new RuleTester({
    parserOptions: { 
        ecmaVersion: 6,
        sourceType: 'module',
    }
}).run('angular-strict-di', rule, {
    invalid: [
        {
            code: `
            export function InvalidControllerNoInject(MyService) {}
            `,
            errors: [
                { message: new RegExp('is not using explicit annotation and cannot be invoked in strict mode') }
            ],
            output: `
            export function InvalidControllerNoInject(MyService) {}
            InvalidControllerNoInject.$inject = ['MyService'];
            `
        },
        {
            code: `
            // @ngInject
            export function InvalidControllerInjectComment() {}
            `,
            errors: [
                { message: new RegExp('is not using explicit annotation and cannot be invoked in strict mode') }
            ]
        },
        {
            code: `
            export function InvalidControllerInjectMismatch(MyService) {};
            InvalidControllerInjectMismatch.$inject = ['hello', 'world'];
            `,
            errors: [
                { message: new RegExp('is not using explicit annotation and cannot be invoked in strict mode') }
            ]
        },
        {
            code: `
            export function InvalidControllerInjectMismatchExtra(MyService) {};
            InvalidControllerInjectMismatchExtra.$inject = ['MyService', 'hello', 'world'];
            `,
            errors: [
                { message: new RegExp('is not using explicit annotation and cannot be invoked in strict mode') }
            ]
        },
        {
            code: `
            const component = {};
            component.controller = function InvalidComponentController($q) {

            };
            export default component;
            `,
            errors: [
                { message: new RegExp('is not using explicit annotation and cannot be invoked in strict mode') }
            ]
        }
    ],

    valid: [
        {
            code: `
                export function ValidControllerNoInjectables() {}
            `,
        },
        {
            code: `
                export function ValidControllerWithInjectable(MyService) {
                };
                ValidControllerWithInjectable.$inject = ['MyService'];
            `,
        },
        {
            code: `
                ValidControllerWithInjectableBefore.$inject = ['MyService'];
                export function ValidControllerWithInjectableBefore(MyService) {
                };
            `,
        },
        {
            code: `
                function validMethodNoInjectables(param1, param2) {}

                export function ValidControllerWithInjectable(MyService) {
                };
                ValidControllerWithInjectable.$inject = ['MyService'];
            `,
        }
    ],
});