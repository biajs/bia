import { JsCode } from '../../code/index';
import { JsFragment } from '../functions/JsFragment';
import { DomProcessor, JsFragmentNode, ParsedNode } from '../../../interfaces';
import { createFragment } from '../dom';

//
// utils
//
import { 
    getDirective, 
    getNextElementNode, 
    getPreviousElementNode,
    nodeHasDirective, 
    removeProcessedDirective,
} from '../../../utils/parsed_node';

import {
    indent,
} from '../../../utils/string';

/**
 * Create child fragments.
 * 
 * @param  {JsCode}                 code
 * @param  {ParsedNode}             currentNode
 * @param  {Array<JsFragmentNode>}  fragments 
 */
export function createChildFragments(code: JsCode, currentNode: ParsedNode, fragments: Array<JsFragmentNode>, fragment: JsFragment) {
    // do nothing if our node doesn't have a for directive
    if (!nodeHasDirective(currentNode, 'for')) return;

    // remove the directive so nobody else processes it
    const directive = getDirective(currentNode, 'for');
    removeProcessedDirective(currentNode, directive);

    // create our for block with a unique name
    const blockName = code.getVariableName(currentNode, 'for_block');
    return createFragment(code, currentNode, fragments, `create_${blockName}`);
}

/**
 * Process the current node.
 * 
 * @param  {JsCode}                 code
 * @param  {ParsedNode}             currentNode
 * @param  {Array<JsFragmentNode>}  fragments 
 */
export function process(code: JsCode, currentNode: ParsedNode, fragment: JsFragment) {
    // do nothing if our node doesn't have a for directive
    if (!nodeHasDirective(currentNode, 'for')) return;

    const directive = getDirective(currentNode, 'if');
    const blockName = code.getVariableName(currentNode, 'for_block');
    const createBlockName = `create_${blockName}`;

    // constructor
    fragment.code.append(`// var ${blockName} = [];`);
    fragment.code.append(`// for (var i = 0, len = foo.length; i < len; i++) {`);
    fragment.code.append('// ' + indent(`${blockName}[i] = ${createBlockName}(vm, foo, foo[i], i);`));
    fragment.code.append(`// }`);
}