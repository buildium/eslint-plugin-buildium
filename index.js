'use strict';

module.exports = {
    rules: {
        'func-names': require('./rules/func-names/func-names'),
        'template-location': require('./rules/template-location/template-location'),
        'imports-lodash': require('./rules/imports/imports')(/^lodash$/i, 'Use underscore or import specific lodash functions instead of requiring all of it'),
        'imports-jquery': require('./rules/imports/imports')(/^jQuery$/, 'Use jquery, not jQuery (this will cause extra code to be bundled)')
    },
    rulesConfig: {
        'func-names': 2,
        'template-location': 2,
        'imports-lodash': 2,
        'imports-jquery': 2
    }
};
