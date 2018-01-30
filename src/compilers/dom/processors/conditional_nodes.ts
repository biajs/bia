import Code from '../../../generators/code';
import Fragment from '../../../generators/fragment';
import { ParsedNode } from '../../../interfaces';
import BranchSelector from '../code/branch_selector';

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

        let name = 'if_block';

        if (nodeHasDirective(currentNode, 'else-if')) {
            name = 'else_if_block';
        } else if (nodeHasDirective(currentNode, 'else')) {
            name = 'else_block';
        }

        // mark the conditional as processed
        setProcessingFlag(currentNode, 'conditionalNodeProcessed');

        return fragment.createChild(`create_${name}`, currentNode);
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
            return processStandAloneIfBlock(code, currentNode, fragment);
        }
        
        // if blocks that have else branches
        else if (hasIfDirective && nextNodeIsConditional) {
            return processFirstLogicalBranch(code, currentNode, fragment);
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
function processStandAloneIfBlock(code: Code, currentNode: ParsedNode, fragment: Fragment) {
    const directive = getDirective(currentNode, 'if');
    const condition = namespaceRootIdentifiers(directive.expression);
    const name = fragment.define(currentNode, 'if_block');
    const parentName = fragment.define(currentNode.parent, currentNode.parent.tagName);

    // figure out if we need to insert with an anchor
    let mountArgs = [`#${parentName}`];
    
    const nextNode = getNextElementNode(currentNode);

    if (nextNode) {
        if (nextNode.type === 'TEXT') {
            mountArgs.push(fragment.define(nextNode, 'text'));
        } else if (nextNode.type === 'ELEMENT') {
            mountArgs.push(fragment.define(nextNode, nextNode.tagName));
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
                #${name}.m(${mountArgs.join(', ')});
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

//
// first logical branches
//
function processFirstLogicalBranch(code, currentNode, fragment) {
    const directive = getDirective(currentNode, 'if');
    const name = fragment.define(currentNode, 'if_block');
    const currentBlockType = fragment.define(currentNode, 'current_block_type');
    const selectBlockType = fragment.define(currentNode, 'select_block_type');
    
    // create a selector function, and add our if branch to it
    const branchSelector = new BranchSelector(selectBlockType);

    branchSelector.add(namespaceRootIdentifiers(directive.expression), `#create_${name}`);

    code.append(branchSelector, 'fragments');

    // create 

    // constructor
    fragment.content.append(`
        // #${currentBlockType} = #${selectBlockType}(#vm);
        // #${name} = #${currentBlockType}(#vm);
    `);

    // create
    fragment.create.append(`
        // hello there
    `)
}