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
        const hasElseDirective = nodeHasDirective(currentNode, 'else');
        const nextNode = getNextElementNode(currentNode);
        const nextNodeIsConditional = nextNode && nodeHasDirective(nextNode, 'else-if', 'else');

        // stand-alone if blocks
        if (hasIfDirective && !nextNodeIsConditional) {
            return processStandAloneIfBlock(code, currentNode, fragment);
        }
        
        // if blocks that have else branches
        else if (hasIfDirective && nextNodeIsConditional) {
            return processFirstLogicalBranch(code, currentNode, fragment);
        }

        // else blocks
        else if (hasElseDirective) {
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
    let anchor;
    let mountArgs = [`#${parentName}`];
    
    const nextNode = getNextElementNode(currentNode);

    if (nextNode) {
        if (nextNode.type === 'TEXT') {
            mountArgs.push(fragment.define(nextNode, 'text'));
        } else if (nextNode.type === 'ELEMENT') {
            // if the next node is dynamic, we need to use an anchor comment
            if (nodeHasDirective(nextNode, 'if')) {
                anchor = fragment.define(currentNode, 'if_block_anchor');
                mountArgs.push(anchor);
            }

            // otherwise just use the next element
            else mountArgs.push(fragment.define(nextNode, nextNode.tagName));
        }
    }

    // constructor
    fragment.content.append(`
        #${name} = (${condition}) && #create_${name}(#vm);
    `);

    // create
    const createLine = `if (#${name}) #${name}.c();`;
    if (anchor) {
        fragment.create.append(`
            ${createLine}
            #${anchor} = @createComment();
        `)
    } else {
        fragment.create.append(createLine);
    }

    // mount
    const mountLine = `if (#${name}) #${name}.m(#${parentName});`;
    
    if (anchor) {
        fragment.mount.append(`
            ${mountLine}
            @appendNode(#${anchor}, #${parentName});
        `)
    } else {
        fragment.mount.append(mountLine);
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

    // create 

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
            #${name}.m(#${parentName});
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
// last logical branch
//
function processLastLogicalBranch(code, currentNode, fragment) {
    // find original if branch
    const ifNode = getPreviousNodeWithDirective(currentNode, 'if');

    // find selector for that node
    const blockSelector = code.containers.fragments
        .find(obj => obj instanceof BranchSelector && obj.ifNode === ifNode);

    // create else block
    const name = fragment.define(currentNode, 'else_block');

    // append else branch to selector
    blockSelector.add(currentNode, `#create_${name}`);
}