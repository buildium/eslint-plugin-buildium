'use strict';

/*
 * Force fs.readFileSync calls to be outside of module.exports = ..., which is a Buildium convention
 */
module.exports = function templateLocation(context) {
    var insideModuleExports;
    var isRoutesFile = context.getFilename().indexOf('routes.js') > 0;
    return {
        FunctionExpression: function enterMember(node) {
            var parent = context.getAncestors().pop();
            if (parent.left &&
                parent.left.object &&
                parent.left.object.name === 'module' &&
                parent.left.property.name === 'exports') {
                insideModuleExports = true;
            }
        },
        'FunctionExpression:exit': function exitMember(node) {
            var parent = context.getAncestors().pop();
            if (parent.left &&
                parent.left.object &&
                parent.left.object.name === 'module' &&
                parent.left.property.name === 'exports') {
                insideModuleExports = false;
            }
        },
        CallExpression: function callExpression(node) {
            if (!isRoutesFile &&
                node.callee &&
                node.callee.object &&
                node.callee.object.name === 'fs' &&
                insideModuleExports) {
                context.report(node, 'readFileSync calls should live outside of the function assigned to module.exports');
            }
        }
    };
};
