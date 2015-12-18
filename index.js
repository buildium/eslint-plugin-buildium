'use strict';

module.exports = {
    rules: {
        'bd-func-names': require('./rules/func-names/func-names'),
        'bd-template-location': require('./rules/template-location/template-location'),
        'bd-imports-lodash': require('./rules/imports/imports')(/^lodash$/i, 'Use underscore or import specific lodash functions instead of requiring all of it'),
        'bd-imports-jquery': require('./rules/imports/imports')(/^jQuery$/, 'Use jquery, not jQuery (this will cause extra code to be bundled)')
    },
    rulesConfig: {
        'bd-func-names': 2,
        'bd-template-location': 2,
        'bd-imports-lodash': 2,
        'bd-imports-jquery': 2
    }
};
