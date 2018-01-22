import Code from '../../../generators/code';
import Fragment from '../../../generators/fragment';
import { ParsedNode } from '../../../interfaces';

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
        if (!currentNode.parent) {
            manageRootElement(code, currentNode, fragment);
        }
    },

    //
    // post-process the current node
    //
    postProcess(code: Code, currentNode: ParsedNode, fragment: Fragment) {
        // hydrate the fragment if necessary, and return the root element
        if (!currentNode.parent) {
            // hydrateFragment
            returnRootElement(code, currentNode, fragment);
        }
    },
}

//
// manage the root element
//
function manageRootElement(code, currentNode, fragment) {
    const tagName = currentNode.tagName;
    const varName = fragment.define(currentNode, tagName);
    
    // create
    fragment.create.push(`
        ${varName} = @createElement('${tagName}');
    `);
}

//
// return the root element
//
function returnRootElement(code, currentNode, fragment) {
    const tagName = currentNode.tagName;
    const varName = fragment.define(currentNode, tagName);

    fragment.create.push(`
        return ${varName};
    `);
}