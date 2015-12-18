'use strict';

/*
 * Largely taken from eslint's func-names rule, but added check to skip functions passed as arguments
 */
module.exports = function bdFuncNames(context) {
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
        FunctionExpression: function expression(node) {
            var name = node.id && node.id.name;

            if (!name && !isObjectOrClassMethod() && parentIsNotFunction()) {
                context.report(node, 'Missing function expression name.');
            }
        }
    };
};
