import Code from '../../../generators/code';
import Fragment from '../../../generators/fragment';
import { NodeDirective, ParsedNode } from '../../../interfaces';

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
    getProcessingFlag,
    hasProcessingFlag,
    nodeHasDirective, 
    setProcessingFlag,
} from '../../../utils/parsed_node';

//
// loop nodes
//
export default {

    //
    // define a child fragment
    //
    childFragment(code: Code, currentNode: ParsedNode, fragment: Fragment) {
        // do nothing if our node doesn't have a for directive, or we've already processed it
        if (!hasUnprocessedForDirective(currentNode)) return;


        // set a flag so we don't re-process this directive
        setProcessingFlag(currentNode, 'forDirectiveProcessed');

        // create a block with a unique name, and add it to the function scope
        const name = getProcessingFlag(currentNode, 'forBlockName');
        return fragment.createChild(name, currentNode);
    },

    //
    // process the current node
    //
    process(code: Code, currentNode: ParsedNode, fragment: Fragment) {
        if (!hasUnprocessedForDirective(currentNode)) return;

        const directive = getDirective(currentNode, 'for');
        const parsedDirective = parseLoopExpression(directive);
        const createForBlock = code.getUniqueIdentifier('create_for_block');
        const forBlocks = fragment.define(currentNode, 'for_blocks');
        const parentName = fragment.define(currentNode.parent, currentNode.parent.tagName);
        const namespacedSource = namespaceRootIdentifiers(parsedDirective.source);

        setProcessingFlag(currentNode, 'forBlockName', createForBlock);

        // constructor
        fragment.content.append(`
            /*
            #${forBlocks} = [];
            for (var #i = 0, #len = #${namespacedSource}.length; #i < #len; i++) {
                #${forBlocks}[#i] = ${createForBlock}(vm);
            }
            */
        `)

        // create
        fragment.create.append(`
            /*
            for (var #i = 0, #len = target.length; i < len; i++) {
                #${forBlocks}[#i] = #${createForBlock}(vm);
            }
            */
        `)
    },

    //
    // post-process the current node
    //
    postProcess(code: Code, currentNode: ParsedNode, fragment: Fragment) {
        
    },
}

// helper function to check if a node should be processed
function hasUnprocessedForDirective(node) {
    return nodeHasDirective(node, 'for') 
        && !hasProcessingFlag(node, 'forDirectiveProcessed');
}

// parse the loop expression
// for="person in people" -> { key: 'person', index: null, source: 'people' }
// @todo: for="(person, index) in people" -> { key: 'person', index: 'index', source: 'people' }
function parseLoopExpression(directive: NodeDirective) {
    const index = null;
    const [key, source] = directive.expression.split(' in ');

    return { key, source, index };
}