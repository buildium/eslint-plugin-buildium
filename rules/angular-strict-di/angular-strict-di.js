module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'disallow functions or providers that have not been explicitly annotated',
            category: 'Possible Errors',
        },
        fixable: 'code',
    },
    create: function(context) {
        const diNodes = [];
        const injectArraysByFunction = {};

        function getIndentationForNode(node) {
            const firstTokenInLine = context.getSourceCode()
                .getTokensBefore(node)
                .filter(token => token.loc.start.line === node.loc.start.line)
                .pop() || node;
            const startingColumn = firstTokenInLine.loc.start.column;
            return new Array(startingColumn + 1).join(' ');
        }

        function report(node) {
            const nodeName = node.id.name;
            const indent = getIndentationForNode(node);

            context.report({
                node, 
                message: '{{ nodeName }} is not using explicit annotation and cannot be invoked in strict mode', 
                data: { nodeName },
                fix: function(fixer) {
                    const params = node.params.map(param => param.name);
                    const quotedParams = params.map(param => `'${param}'`).join(', ');
                    const injectArray = `\n${indent}${nodeName}.$inject = [${quotedParams}];`;
                    
                    const fixings = [];
                    fixings.push(fixer.insertTextAfter(node, injectArray));

                    const annotateComment = getNgAnnotateComment(node);
                    if (annotateComment) {
                        fixings.push(fixer.remove(annotateComment));
                    }

                    return fixings;
                }
            });
        }

        function getNgAnnotateComment(node) {
            const sourceCode = context.getSourceCode();
            const comments = sourceCode.getAllComments();
            const annotateComments = comments.filter(comment => comment.value.trim() === '@ngInject');

            const comment = annotateComments.find(comment => {
                const tokensBetween = sourceCode.getTokensBetween(comment, node);
                const commentBelongsToAnother = tokensBetween.some(token => token.type === 'Keyword' && ['function', 'class'].includes(token.value));
                return !commentBelongsToAnother;
            });

            return comment;
        }

        function hasNgAnnotateComment(node) {
            return Boolean(getNgAnnotateComment(node));
        }

        function isAngularInjectable(param) {
            return param.startsWith('$');
        }

        function isCustomInjectable(param) {
            return /^[A-Z]/.test(param);
        }

        function isAngularFunctionOrProvider(node) {
            if (!node.params) { return false; }
            const params = node.params.map(param => param.name);
            return params.some(isAngularInjectable) 
                || params.some(isCustomInjectable);
        }

        function injectArrayExistsForNode(node) {
            const functionName = node.id.name;
            const injectArray = injectArraysByFunction[functionName];

            if (!injectArray) { return false; }
            
            const params = node.params.map(param => param.name);
            if (!(injectArray.length === params.length)) { return false; }
            
            const paramsAreMatching = params.every((param, index) => param === injectArray[index]);
            if (!paramsAreMatching) { return false; }
            
            return true;
        }

        function verifyDependencyInjection() {
            diNodes.forEach(node => {
                if (!injectArrayExistsForNode(node)) {
                    report(node);
                }
            });
        }

        function checkFunctionForDependencyInjection(node) {
            const requiresAnnotation = hasNgAnnotateComment(node) || isAngularFunctionOrProvider(node);
            if (!requiresAnnotation) { return; }

            diNodes.push(node);
        }

        return {
            // record all the functions that would require dependency injection
            FunctionDeclaration: checkFunctionForDependencyInjection,
            FunctionExpression: checkFunctionForDependencyInjection,

            // collect all the $inject arrays found in the file
            AssignmentExpression: function(node) {
                function isInjectArray(node) {
                    return node.left.property.name === '$inject'
                        && node.right.type === 'ArrayExpression';
                }

                if (isInjectArray(node)) {
                    const functionName = node.left.object.name;
                    injectArraysByFunction[functionName] = node.right.elements.map(element => element.value);
                }
            },

            // assert that all functions requiring DI have matching $inject arrays
            "Program:exit": function() {
                verifyDependencyInjection();
            },
        }
    }
};
