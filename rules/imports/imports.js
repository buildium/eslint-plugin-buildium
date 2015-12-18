'use strict';

/*
 * Stop certain patterns in require statements
 */
module.exports = function generateRule(pattern, message) {
    return function requireCheckRule(context) {
        return {
            CallExpression: function callExpression(node) {
                if (node.callee &&
                    node.callee.type === 'Identifier' &&
                    node.callee.name.toLowerCase() === 'require' &&
                    node.arguments.length === 1 &&
                    pattern.test(node.arguments[0].value)) {
                    context.report(node, message);
                }
            }
        }
    }
};
