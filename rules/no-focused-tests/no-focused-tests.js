module.exports = function bdTestingBlocks(context) {
    var focusedBlockName = ['fdescribe', 'ddescribe', 'iit', 'fit']

    return {
        CallExpression: function callExpression(node) {
            if (node.callee && node.callee.type === 'Identifier' 
                && focusedBlockName.indexOf(node.callee.name.toLowerCase()) !== -1) {                
                    context.report(node, "Do not check in jasmine tests with the following: fdescribe, fit, iit, or ddescribe.");
            }
        }
    }
};