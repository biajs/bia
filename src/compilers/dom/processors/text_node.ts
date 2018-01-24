const falafel = require('falafel');
import Code from '../../../generators/code';
import Fragment from '../../../generators/fragment';
import { ParsedNode } from '../../../interfaces';

//
// utils
//
import {
    isIdentifier,
    isComputedProp,
    isObjectProp,
    namespaceRootIdentifiers,
} from '../../../utils/code';

import {
    hasProcessingFlag ,
    hasTextInterpolations,
    isTextNode,
} from '../../../utils/parsed_node';

import {
    escape,
    isInterpolation,
    splitInterpolations,
} from '../../../utils/string';
import { isObject } from 'util';

//
// text node processor
//
export default {

    //
    // define a child fragment
    //
    childFragment(code: Code, currentNode: ParsedNode, fragment: Fragment) {
        
    },

    //
    // process the current node
    //
    process(code: Code, currentNode: ParsedNode, fragment: Fragment) {
        // do nothing if the current node isn't a text node or
        // was already created as part of a static element.
        if (
            !isTextNode(currentNode) ||
            hasProcessingFlag(currentNode, 'wasCreatedBySetText') ||
            hasProcessingFlag(currentNode, 'wasCreatedByInnerHTML')
        ) {
            return;
        }

        // define our text node and get the parent element's var name
        const varName = fragment.define(currentNode, 'text');
        const parentVarName = fragment.define(currentNode.parent);

        // fragment.define(currentNode, varName);

        // process our static or dynamic text
        if (currentNode.textInterpolations.length === 0) {
            // processStaticText
        } else {
            processDynamicText(currentNode, fragment, varName, parentVarName);
        }
    },

    //
    // post-process the current node
    //
    postProcess(code: Code, currentNode: ParsedNode, fragment: Fragment) {
        
    },
}

//
// process dynamic text
//
function processDynamicText(currentNode, fragment, varName, parentVarName) {
    const valName = varName + '_value';
    const fnName = varName + '_content';
    fragment.define(null, valName);

    // create our text concatenation and dependencies
    const dependencies = [];
    const concatenation = splitInterpolations(currentNode.textContent)
        .reduce((segments, text) => {
            if (isInterpolation(text)) {
                const expression = text.slice(2, -2).trim();
                dependencies.push(expression);
                return segments.concat(`(${expression})`);
            }

            return segments.concat(`'${escape(text)}'`);
        }, [])
        .join(' + ');
        
    const changeCondition = getChangedCondition(dependencies, []);

    // constructor
    fragment.content.append(`
        function #${fnName}() {
            return ${namespaceRootIdentifiers(concatenation)};
        }
    `);

    // create
    fragment.create.append(`
        #${valName} = #${fnName}();
        ${varName} = @createText(#${valName});
    `);

    // mount
    fragment.mount.append(`
        @appendNode(${varName}, ${parentVarName});
    `);

    // update
    fragment.update.append(`
        if (${changeCondition}#${valName} !== (#${valName} = #${fnName}())) {
            @setText(${varName}, #${valName})
        }
    `)
}

function getChangedCondition(interpolations, scope) {
    // @todo: support fragment scopes

    // for simplicity, we'll re-calculate our text node
    // whenever one of the root identifiers changes.
    // down the road we should optimize this conditional.
    // see: https://github.com/scottbedard/bia/issues/8
    const rootIdentifiers = new Set;

    interpolations.forEach(interpolation => {
        falafel(interpolation, node => {
            // root identifiers
            if (isIdentifier(node) && !isObjectProp(node)) {
                rootIdentifiers.add(node.name);
            }

            // root identifiers, nested as computed object properties
            if (isIdentifier(node) && isComputedProp(node)) {
                rootIdentifiers.add(node.name);
            }
        });
    });

    const rawDeps = Array.from(rootIdentifiers).join(' || ');
    const prefixedDeps = namespaceRootIdentifiers(rawDeps, '#changed', scope);

    return prefixedDeps.length ? `(${prefixedDeps}) && ` : '';
}