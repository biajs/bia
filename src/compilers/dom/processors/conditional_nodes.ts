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
            !isElementNode(currentNode) ||
            !nodeHasDirective(currentNode, 'if', 'else-if', 'else') ||
            hasProcessingFlag(currentNode, 'conditionalNodeProcessed')
        ) return;

        let name = 'create_if_block';

        // mark the conditional as processed
        setProcessingFlag(currentNode, 'conditionalNodeProcessed');

        return fragment.createChild(name, currentNode);
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
// stand alone if blocks
//
function processStandAloneIfBlock(code: Code, currentNode: ParsedNode, fragment: Fragment, childFragment: Fragment) {
    const directive = getDirective(currentNode, 'if');
    const condition = namespaceRootIdentifiers(directive.expression);
    const name = fragment.define(currentNode, 'if_block');
    const parentName = fragment.define(currentNode.parent);

    // figure out if we need to insert with an anchor
    let anchor = 'null';
    
    const nextNode = getNextElementNode(currentNode);

    if (nextNode) {
        if (nextNode.type === 'TEXT') {
            anchor = fragment.define(nextNode, 'text')
        } else if (nextNode.type === 'ELEMENT') {
            anchor = fragment.define(nextNode, nextNode.tagName);
        }
    }

    // constructor
    fragment.content.append(`
        #${name} = (${condition}) && #create_${name}(#vm);
    `);

    // create
    fragment.create.append(`
        if (#${name}) #${name}.c();
    `);

    // mount
    fragment.mount.append(`
        if (#${name}) #${name}.m(#${parentName});
    `)

    // update
    fragment.update.append(`
        if (${condition}) {
            if (!#${name}) {
                #${name} = #create_${name}(vm);
                #${name}.c();
                #${name}.m(#${parentName}, ${anchor});
            }
        } else if (#${name}) {
            #${name}.u();
            #${name}.d();
            #${name} = null;
        }
    `);

    // unmount

    // destroy
}