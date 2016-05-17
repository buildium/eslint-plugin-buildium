'use strict';

module.exports = function taggedTemplates(context) {
    return {
        TaggedTemplateExpression: function callExpression(node) {
            context.report(node, 'Transpiled tagged template literals are slow in some browsers, so we should avoid them for now')
        }
    };
};
