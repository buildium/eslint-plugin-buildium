module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'disallow functions or providers that have not been explicitly annotated',
            category: 'Possible Errors',
        },
        fixable: 'code',
        schema: [
            {
                type: "object",
                properties: {
                    inlineArray: {
                        type: "boolean",
                    }
                },
                additionalProperties: false
            }
        ],
    },
    create: function(context) {
        const defaultOptions = {
            inlineArray: false
        };

        const [ userOptions ] = context.options;
        const ruleOptions = Object.assign({}, defaultOptions, userOptions);

        const diNodes = [];
        const injectArraysByFunction = {};

        function getIndentationForNode(node) {
            const tokensInLine = context.getSourceCode()
                .getTokensBefore(node)
                .filter(token => token.loc.start.line === node.loc.start.line);

            tokensInLine.sort((t1, t2) => t1.start - t2.start);
            const firstTokenInLine = tokensInLine.shift() || node;
            const startingColumn = firstTokenInLine.loc.start.column;

            return new Array(startingColumn + 1).join(' ');
        }

        function getEffectiveNodeName(node) {
            function isAssignedToProperty(node) {
                return (node.parent && node.parent.type === 'AssignmentExpression' && node.parent.left.type === 'MemberExpression')
                    || (node.type === 'AssignmentExpression' && isAssignedToProperty(node.left));
            }

            function isAssignedToVariable(node) {
                return node.parent 
                    && node.parent.type === 'VariableDeclarator';
            }

            if (isAssignedToVariable(node)) {
                return node.parent.id.name;
            } else if (!isAssignedToProperty(node)) {
                return node.id && node.id.name
            }

            let relevantNode = node.parent.left || node.left;
            let path = [relevantNode.property.name];
            let object = relevantNode.object;

            while (object) {
                if (object.property) {
                    path.unshift(object.property.name);
                }
                if (object.name) {
                    path.unshift(object.name);
                }
                object = object.object;
            }

            return path.join('.');
        }

        function report(node) {
            const nodeName = getEffectiveNodeName(node);
            const indent = getIndentationForNode(node);

            context.report({
                node, 
                message: '{{ nodeName }} is not using explicit annotation and cannot be invoked in strict mode', 
                data: { nodeName },
                fix: function(fixer) {
                    const fixings = [];
                    const params = node.params.map(param => param.name);
                    const quotedParams = params.map(param => `'${param}'`).join(', ');

                    function addInjectArrayAfter() {
                        const injectArray = `\n${indent}${nodeName}.$inject = [${quotedParams}];`;
                        fixings.push(fixer.insertTextAfter(node, injectArray));
                    }

                    function addInlineInjectArray() {
                        fixings.push(fixer.insertTextBefore(node, `[${quotedParams}, `));
                        fixings.push(fixer.insertTextAfter(node, ']'));
                    }

                    function removeAnnotateComment() {
                        const annotateComment = getNgAnnotateComment(node);
                        if (annotateComment) {
                            fixings.push(fixer.remove(annotateComment));
                        }
                    }

                    const inlineInjectRequired = !node.id
                        || (node.parent && ['Property', 'CallExpression'].includes(node.parent.type));
                    
                    if (inlineInjectRequired && !ruleOptions.inlineArray) {
                        return;
                    } else if (inlineInjectRequired) {
                        addInlineInjectArray();
                    } else {
                        addInjectArrayAfter();
                    }

                    removeAnnotateComment();
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
                const commentOccursBefore = comment.start <= node.start;
                const commentBelongsToAnother = tokensBetween.some(token => token.type === 'Keyword' && ['function', 'class'].includes(token.value));
                return commentOccursBefore && !commentBelongsToAnother;
            });

            return comment;
        }

        function hasNgAnnotateComment(node) {
            return Boolean(getNgAnnotateComment(node));
        }

        function isAngularInjectable(param) {
            return typeof param === 'string' && param.startsWith('$');
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

        function injectArrayMatchesNodeParams(injectArray, node) {
            const params = node.params.map(param => param.name);
            if (injectArray.length !== params.length) { return false; }
            
            const paramsAreMatching = params.every((param, index) => param === injectArray[index]);
            if (!paramsAreMatching) { return false; }
            
            return true;
        }

        function injectArrayExistsForNode(node) {
            if (!node.id) { return false; }

            const functionName = getEffectiveNodeName(node);
            const injectArray = injectArraysByFunction[functionName];

            if (!injectArray) { return false; }
            if (!injectArrayMatchesNodeParams(injectArray, node)) { return false; }
            return true;
        }

        function inlineArrayExistsForNode(node) {
            const hasParentArray = node.parent && node.parent.type === 'ArrayExpression';
            if (!hasParentArray) { return false; }

            const injectArray = node.parent.elements.slice(0, -1).map(element => element.value);
            if (!injectArrayMatchesNodeParams(injectArray, node)) { return false; }
            return true;
        }

        function verifyDependencyInjection() {
            diNodes.forEach(node => {
                const isAnnotated = injectArrayExistsForNode(node)
                    || (ruleOptions.inlineArray && inlineArrayExistsForNode(node));
                
                if (!isAnnotated) {
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
                    return node.left.property
                        && node.left.property.name === '$inject'
                        && node.right.type === 'ArrayExpression';
                }

                if (isInjectArray(node)) {
                    const functionName = getEffectiveNodeName(node).replace('.$inject', '');

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
