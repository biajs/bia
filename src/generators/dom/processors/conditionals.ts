import { DomProcessor, NodeDirective, JsFragmentNode, ParsedNode } from '../../../interfaces';
import { JsCode, JsIf } from '../../code/index';
import { JsConditional } from '../functions/JsConditional';
import { JsFragment } from '../functions/JsFragment';
import { createFragment } from '../dom';

//
// utils
//
import { escape } from '../../../utils/string';

import { 
    isCodeInstance, 
    namespaceRootIdentifiers,
    findConditionalWithNode,
} from '../../../utils/code';

import { 
    getDirective, 
    getNextElementNode, 
    getPreviousElementNode,
    nodeHasDirective, 
    removeProcessedDirective,
} from '../../../utils/parsed_node';

/**
 * Create child fragments.
 * 
 * @param  {JsCode}                 code
 * @param  {ParsedNode}             currentNode
 * @param  {Array<JsFragmentNode>}  fragments 
 */
export function createChildFragments(code: JsCode, currentNode: ParsedNode, fragments: Array<JsFragmentNode>, fragment: JsFragment) {
    // b-if
    if (nodeHasDirective(currentNode, 'if')) {
        const directive = getDirective(currentNode, 'if');
        const blockName = code.getVariableName(currentNode, 'if_block');
        removeProcessedDirective(currentNode, directive);

        return createFragment(code, currentNode, fragments, `create_${blockName}`);
    }

    // b-else-if
    else if (nodeHasDirective(currentNode, 'else-if')) {
        const directive = getDirective(currentNode, 'else-if');
        const blockName = code.getVariableName(currentNode, 'else_if_block');
        removeProcessedDirective(currentNode, directive);

        return createFragment(code, currentNode, fragments, `create_${blockName}`);
    }

    // b-else
    else if (nodeHasDirective(currentNode, 'else')) {
        const directive = getDirective(currentNode, 'else');
        const blockName = code.getVariableName(currentNode, 'else_block');
        removeProcessedDirective(currentNode, directive);

        return createFragment(code, currentNode, fragments, `create_${blockName}`);
    }
};

/**
 * Process the current node.
 * 
 * @param  {JsCode}                 code
 * @param  {ParsedNode}             currentNode
 * @param  {Array<JsFragmentNode>}  fragments 
 */
export function process(code: JsCode, currentNode: ParsedNode, fragment: JsFragment) {
    
    // b-if
    if (nodeHasDirective(currentNode, 'if')) {
        const directive = getDirective(currentNode, 'if');
        const next = getNextElementNode(currentNode);

        // if the next element node has an else-if / else directive
        // we need to create a block selector to determine which
        // fragment should be used when this node is mounted.
        if (next && (nodeHasDirective(next, 'else-if') || nodeHasDirective(next, 'else'))) {
            createFirstLogicalBranch(code, currentNode, fragment, directive);
        }

        // otherwise create a stand-alone if block.
        else {
            createStandAloneIfBlock(code, currentNode, fragment, directive);
        }
    }

    // b-else-if
    else if (nodeHasDirective(currentNode, 'else-if')) {
        const directive = getDirective(currentNode, 'else-if');

        createElseIfBranch(code, currentNode, fragment, directive);
    }

    // b-else
    else if (nodeHasDirective(currentNode, 'else')) {
        const directive = getDirective(currentNode, 'else');

        createElseBranch(code, currentNode, fragment, directive);
    }
};

/**
 * Process the current node after all child processors are complete.
 * 
 * @param  {JsCode}                 code
 * @param  {ParsedNode}             currentNode
 * @param  {Array<JsFragmentNode>}  fragments 
 */
export function postProcess(code: JsCode, currentNode: ParsedNode, fragment: JsFragment) {
    //
};

//
// create the first part of a multi-part if branch
//
function createFirstLogicalBranch(code: JsCode, currentNode: ParsedNode, fragment: JsFragment, directive: NodeDirective): void {
    // create a new block selector for the logical branches
    const selector = new JsConditional({ rootCode: code });
    const name = code.getVariableName(currentNode, 'if_block');

    // @todo: using insertBefore might be a better option here...
    code.append(null);
    code.append(selector);

    // and append our initial if branch
    selector.addIf(currentNode, `create_${name}`);

    // define the block within our fragment
    const blockName = fragment.getVariableName(selector, 'current_block_type');
    const ifName = fragment.getVariableName(currentNode, 'if_block');    
    const parentEl = fragment.getVariableName(currentNode.parent);

    fragment.code.append(`var ${blockName} = ${selector.name}(vm);`);
    fragment.code.append(`var ${ifName} = ${blockName}(vm);`)

    // create
    fragment.create.append(`${ifName}.c();`);

    // mount the if block to our parent
    fragment.mount.append(`${ifName}.m(${parentEl}, null);`)
}

// 
// create the middle parts of a multi-part branch
//
function createElseIfBranch(code: JsCode, currentNode: ParsedNode, fragment: JsFragment, directive: NodeDirective): void {
    // find the previous element node
    const prev = getPreviousElementNode(currentNode);
    const conditional = findConditionalWithNode(code, prev);

    // append the else-if branch
    if (conditional) {
        const name = code.getVariableName(currentNode, 'else_if_block');
        conditional.addIf(currentNode, `create_${name}`);
    }
}

function createElseBranch(code: JsCode, currentNode: ParsedNode, fragment: JsFragment, directive: NodeDirective): void {
    // find the previous element node
    const prev = getPreviousElementNode(currentNode);
    const conditional = findConditionalWithNode(code, prev);

    // append the else branch
    if (conditional) {
        const name = code.getVariableName(currentNode, 'else_block');
        conditional.addElse(currentNode, `create_${name}`);
    }
}

//
// create if blocks that have no other branches
//
function createStandAloneIfBlock(code: JsCode, currentNode: ParsedNode, fragment: JsFragment, directive: NodeDirective): void {
    const blockName = code.getVariableName(currentNode, 'if_block');
    const condition = namespaceRootIdentifiers(directive.expression);
    const createBlockName = `create_${blockName}`;
    const parentEl = fragment.getVariableName(currentNode.parent);

    // define our if block if we need it
    fragment.code.append(`var ${blockName} = (${condition}) && ${createBlockName}(vm);`);

    // inject the condition into our create hook
    fragment.create.append(`if (${blockName}) ${blockName}.c();`);

    // mount the if block to our parent
    fragment.mount.append(`if (${blockName}) ${blockName}.m(${parentEl}, null);`);

    // inject the condition into our update hook
    fragment.update.append(new JsIf({
        condition,
        content: [
            new JsIf({
                condition: `!${blockName}`,
                content: [
                    `${blockName} = ${createBlockName}(vm);`,
                    `${blockName}.c();`,
                    `${blockName}.m(${parentEl}, null);`,
                ],
            }),
        ],
        elseIf: [
            {
                condition: blockName,
                content: [
                    `${blockName}.u();`,
                    `${blockName}.d();`,
                    `${blockName} = null;`,
                ],
            },
        ],
    }));

}