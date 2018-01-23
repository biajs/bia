import Code from '../../../generators/code';
import Fragment from '../../../generators/fragment';
import { ParsedNode } from '../../../interfaces';

//
// utils
//
import {
    findRootIdentifiers,
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
    const fnName = varName + '_content';

    // create our text concatenation and dependencies
    const dependencies = [];
    const concatenation = splitInterpolations(currentNode.textContent)
        .reduce((segments, text) => {
            if (isInterpolation(text)) {
                const expression = text.slice(2, -2).trim();
                dependencies.push(expression);
                return segments.concat(`(${namespaceRootIdentifiers(expression)})`);
            }

            return segments.concat(`'${escape(text)}'`);
        }, [])
        .join(' + ');

    // constructor
    fragment.content.append(`
        function #${fnName}() {
            return ${concatenation};
        }
    `);

    // create
    fragment.create.append(`
        ${varName} = @createText(#${fnName}());
    `);

    // mount
    fragment.mount.append(`
        @appendNode(${varName}, ${parentVarName});
    `);
}