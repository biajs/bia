import Code from '../../../generators/code';
import Fragment from '../../../generators/fragment';
import { ParsedNode } from '../../../interfaces';

//
// utils
//
import {
    namespaceRootIdentifiers,
} from '../../../utils/code';

import { 
    getDirective, 
    getNextElementNode, 
    getPreviousElementNode,
    hasProcessingFlag,
    isElementNode,
    nodeHasDirective,
    setProcessingFlag,
} from '../../../utils/parsed_node';

//
// conditional nodes
//
export default {

    //
    // define a child fragment
    //
    childFragment(code: Code, currentNode: ParsedNode, fragment: Fragment) {
        if (
            nodeHasDirective(currentNode, 'if', 'else-if', 'else') &&
            !hasProcessingFlag(currentNode, 'conditionalNodeProcessed')
        ) {
            return fragment.createChild('create_if_block', currentNode);
        }
    },

    //
    // process the current node
    //
    process(code: Code, currentNode: ParsedNode, fragment: Fragment, childFragment: null | Fragment) {
        // do nothing if we aren't an element or don't have a conditional directive
        if (
            !isElementNode(currentNode) || 
            !nodeHasDirective(currentNode, 'if', 'else-if', 'else') ||
            hasProcessingFlag(currentNode, 'conditionalNodeProcessed')
        ) {
            return;
        }

        const hasIfDirective = nodeHasDirective(currentNode, 'if');
        const nextNode = getNextElementNode(currentNode);
        const nextNodeIsConditional = nextNode && nodeHasDirective(nextNode, 'if', 'else-if', 'else');

        // stand-alone if blocks
        if (hasIfDirective && !nextNodeIsConditional) {
            return processStandAloneIfBlock(code, currentNode, fragment, childFragment);
        }
    },

    //
    // post-process the current node
    //
    postProcess(code: Code, currentNode: ParsedNode, fragment: Fragment) {
        
    },
}

//
// process a stand alone if block
//
function processStandAloneIfBlock(code: Code, currentNode: ParsedNode, fragment: Fragment, childFragment: Fragment) {
    setProcessingFlag(currentNode, 'conditionalNodeProcessed');

    const directive = getDirective(currentNode, 'if');
    const condition = namespaceRootIdentifiers(directive.expression);
    const name = fragment.define(currentNode, 'if_block');
    const parentName = fragment.define(currentNode.parent);

    // parent constructor
    fragment.constructorContent.push(`
        // var #${name} = (${condition}) && #create_${name}(#vm);
    `);

    // create
    fragment.createContent.push(`
        if (#${name}) #${name}.c();
    `);

    // mount
    fragment.mountContent.push(`
        if (#${name}) #${name}.m(#${parentName}, null)
    `)

    // update

    // unmount

    // destroy
}