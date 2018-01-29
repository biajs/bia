import Code from '../../../generators/code';
import Fragment from '../../../generators/fragment';
import { ParsedNode } from '../../../interfaces';

//
// utils
//
import { 
    escape,
} from '../../../utils/string';

import { 
    hasConditionalDirective, 
    hasLoopDirective,
    hasOnlyStaticContent,
    hasOnlyStaticText,
    hasProcessingFlag,
    isElementNode, 
    isTextNode,
    setProcessingFlag,
    walkNodeTree,
} from '../../../utils/parsed_node';

//
// element processor
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
        // manage the root element
        if (currentNode === fragment.node) {
            manageRootElement(currentNode, fragment);
        }

        // manage non-root static elements
        else if (
            isElementNode(currentNode) &&
            !hasLoopDirective(currentNode) &&
            !hasConditionalDirective(currentNode) &&
            !hasProcessingFlag(currentNode, 'wasCreatedByInnerHTML')
        ) {
            manageStaticElement(currentNode, fragment);
        }
    },

    //
    // post-process the current node
    //
    postProcess(code: Code, currentNode: ParsedNode, fragment: Fragment) {
        // hydrate the fragment if necessary, and return the root element
        if (!currentNode.parent) {
            // hydrateFragment
            returnRootElement(currentNode, fragment);
        }
    },
}

//
// manage the root element of a fragment
//
function manageRootElement(rootNode, fragment) {
    const tagName = rootNode.tagName;
    const varName = fragment.define(rootNode, tagName);
    
    // create
    fragment.create.append(`
        ${varName} = @createElement('${tagName}');
    `);

    if (hasOnlyStaticText(rootNode)) {
        setProcessingFlag(rootNode.children[0], 'wasCreatedBySetText');
        fragment.create.append(`
            @setText(${varName}, '${escape(rootNode.children[0].textContent)}');
        `);
    } else if (hasOnlyStaticContent(rootNode)) {
        walkNodeTree(rootNode, n => setProcessingFlag(n, 'wasCreatedByInnerHTML'));
        fragment.create.append(`
            ${varName}.innerHTML = '${escape(rootNode.innerHTML)}';
        `);
    }

    // mount
    fragment.mount.append(`
        @insertNode(${varName}, target, anchor);
    `)

    // unmount
    fragment.unmount.append(`
        @detachNode(${varName});
    `);
}

//
// manage a non-root static element
//
function manageStaticElement(currentNode, fragment) {
    
}

//
// return the root element
//
function returnRootElement(rootNode, fragment) {
    const varName = fragment.define(rootNode);

    fragment.create.append(`
        return ${varName};
    `);
}