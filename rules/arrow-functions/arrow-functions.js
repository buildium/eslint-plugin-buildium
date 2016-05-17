'use strict';

/*
 * Largely taken from eslint's func-names rule, but added check to skip functions passed as arguments
 */
module.exports = function bdArrowFunction(context) {
    function isObjectOrClassMethod() {
        var parent = context.getAncestors().pop();

        return (parent.type === 'MethodDefinition' || (
            parent.type === 'Property' && (
                parent.method ||
                parent.kind === 'get' ||
                parent.kind === 'set'
            )
        ));
    }

    function parentIsNotFunction() {
        var parent = context.getAncestors().pop();
        return parent.type !== 'CallExpression';
    }

    return {
        ArrowFunctionExpression: function expression(node) {
            if (!isObjectOrClassMethod() && parentIsNotFunction()) {
                context.report(node, 'Arrow functions may only be used as callbacks');
            }
        }
    };
};
