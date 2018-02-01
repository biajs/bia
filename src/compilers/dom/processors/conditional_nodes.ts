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
    getPreviousNodeWithDirective,
    hasProcessingFlag,
    isElementNode,
    nodeHasDirective,
    setProcessingFlag,
    hasConditionalDirective,
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

        let blockName = 'if_block';    

        if (nodeHasDirective(currentNode, 'else-if')) {
            blockName = 'else_if_block';
        } else if (nodeHasDirective(currentNode, 'else')) {
            blockName = 'else_block';
        }

        // mark the conditional as processed
        setProcessingFlag(currentNode, 'conditionalNodeProcessed');

        const name = fragment.define(currentNode, blockName);

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
        const nextNodeIsConditional = nextNode && nodeHasDirective(nextNode, 'else-if', 'else');

        // stand-alone if blocks
        if (hasIfDirective && !nextNodeIsConditional) {
            return processStandAloneIfBlock(code, currentNode, fragment);
        }
        
        // if blocks with multiple branches
        if (hasIfDirective && nextNodeIsConditional) {
            return processFirstLogicalBranch(code, currentNode, fragment);
        }

        // else-if blocks
        if (nodeHasDirective(currentNode, 'else-if')) {
            return processSecondaryLogicalBranch(code, currentNode, fragment);
        }

        // else blocks
        if (nodeHasDirective(currentNode, 'else')) {
            return processLastLogicalBranch(code, currentNode, fragment);
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
    let anchor, anchorNode = nextNonConditionalNode(currentNode);

    if (anchorNode) {
        if (anchorNode.type === 'ELEMENT') {
            anchor = fragment.define(anchorNode, anchorNode.tagName);
        } else if (anchorNode.type === 'TEXT') {
            anchor = fragment.define(anchorNode, 'text');
        }
        
        mountArgs.push(anchor);
    }

    // constructor
    fragment.content.append(`
        #${name} = (${condition}) && #create_${name}(#vm);
    `);

    // create
    if (anchor) {
        fragment.create.append(`
            if (#${name}) #${name}.c();
            #${anchor} = @createComment();
        `);
    } else {
        fragment.create.append(`
            if (#${name}) #${name}.c();
        `);
    }

    // mount
    if (anchor) {
        fragment.mount.append(`
            if (#${name}) #${name}.m(#${parentName});
            @appendNode(#${anchor}, #${parentName});
        `)
    } else {
        fragment.mount.append(`
            if (#${name}) #${name}.m(#${parentName});
        `);
    }

    // update
    fragment.update.append(`
        if (${condition}) {
            if (!#${name}) {
                #${name} = #create_${name}(#vm);
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
    const selectBlockType = code.getIdentifier('select_block_type');
    const parentName = fragment.define(currentNode.parent, currentNode.parent.tagName);
    
    // create a selector function, and add our if branch to it
    const branchSelector = new BranchSelector(selectBlockType);

    branchSelector.add(currentNode, `#create_${name}`, namespaceRootIdentifiers(directive.expression));

    code.append(branchSelector, 'fragments');

    // determine if we need to use an anchor or not
    let mountArgs = [`#${parentName}`];
    let anchorNode = nextNonConditionalNode(currentNode);

    if (anchorNode) {
        if (anchorNode.type === 'ELEMENT') {
            mountArgs.push(fragment.define(anchorNode, anchorNode.tagName));
        } else if (anchorNode.type === 'TEXT') {
            mountArgs.push(fragment.define(anchorNode, 'text'));
        }
    }

    // constructor
    fragment.content.append(`
        #${currentBlockType} = #${selectBlockType}(#vm);
        #${name} = #${currentBlockType}(#vm);
    `);

    // create
    fragment.create.append(`
        #${name}.c();
    `);

    // mount
    fragment.mount.append(`
        #${name}.m(#${parentName});
    `);

    // update
    fragment.update.append(`
        if (#${currentBlockType} !== (#${currentBlockType} = #${selectBlockType}(#vm))) {
            #${name}.u();
            #${name}.d();
            #${name} = #${currentBlockType}(#vm);
            #${name}.c();
            #${name}.m(${ mountArgs.join(', ') });
        }
    `);

    // unmount
    fragment.unmount.append(`
        #${name}.u();
    `);

    // destroy
    fragment.destroy.append(`
        #${name}.d();
    `);
}

//
// secondary logical branches
//
function processSecondaryLogicalBranch(code, currentNode, fragment) {
    // find the original if branch, and the block selector associated with it
    const ifNode = getPreviousNodeWithDirective(currentNode, 'if');

    const blockSelector = code.containers.fragments
        .find(obj => obj instanceof BranchSelector && obj.ifNode === ifNode);

    // create else-if block
    const directive = getDirective(currentNode, 'else-if');

    // add our else-if condition to the block selector
    const name = fragment.define(currentNode, 'else_if_block');

    blockSelector.add(currentNode, `#create_${name}`, namespaceRootIdentifiers(directive.expression));
}

//
// last logical branch
//
function processLastLogicalBranch(code, currentNode, fragment) {
    // find the original if branch, and the block selector associated with it
    const ifNode = getPreviousNodeWithDirective(currentNode, 'if');

    const blockSelector = code.containers.fragments
        .find(obj => obj instanceof BranchSelector && obj.ifNode === ifNode);

    // create else block
    const name = fragment.define(currentNode, 'else_block');

    // add our else path to the block selector
    blockSelector.add(currentNode, `#create_${name}`);
}

// helper function to find the next node that isn't part of the current condition
function nextNonConditionalNode(node) {
    if (node.parent) {
        for (let i = node.parent.children.indexOf(node) + 1; i < node.parent.children.length; i++) {
            let currentNode = node.parent.children[i];

            if (!nodeHasDirective(currentNode, 'else-if', 'else')) {
                return currentNode;
            }
        }
    }
}