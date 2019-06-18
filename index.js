'use strict';

module.exports = {
    rules: {
        'func-names': require('./rules/func-names/func-names'),
        'no-focused-tests' : require('./rules/no-focused-tests/no-focused-tests'),
        'arrow-function-callback': require('./rules/arrow-functions/arrow-functions'),
        'template-location': require('./rules/template-location/template-location'),
        'tagged-templates': require('./rules/templates/templates'),
        'imports-lodash': require('./rules/imports/imports')(/^lodash$/i, 'Use underscore or import specific lodash functions instead of requiring all of it'),
        'imports-jquery': require('./rules/imports/imports')(/^jQuery$/, 'Use jquery, not jQuery (this will cause extra code to be bundled)'),
        'imports-angular-bsfy': require('./rules/imports/imports')(/^angular-bsfy/, 'We no longer use angular-bsfy, use angular or an angular- package'),
        'angular-strict-di': require('./rules/angular-strict-di/angular-strict-di'),
    },
    rulesConfig: {
        'func-names': 2,
        'no-focused-tests': 2,
        'arrow-function-callback': 2,
        'template-location': 2,
        'tagged-templates': 2,
        'imports-lodash': 2,
        'imports-jquery': 2,
        'imports-angular-bsfy': 2,
        'angular-strict-di': 2
    }
};
