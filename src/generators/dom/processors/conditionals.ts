import { JsCode } from '../../code/index';
import { JsFragment } from '../fragment/JsFragment';
import { JsFragmentNode, ParsedNode } from '../../../interfaces';
import { escape } from '../../../utils/string';

import { createFragment } from '../dom';
import { nodeHasDirective } from '../../../utils/parsed_node';

import { 
    //
} from '../helpers/index';

/**
 * Define fragment.
 * 
 * @param  {JsCode}     code 
 * @param  {ParsedNode} node
 * @param  {JsFragment} fragment 
 * @return {void}
 */
export function defineFragment(code: JsCode, node: ParsedNode, fragments: Array<JsFragmentNode>, fragment: JsFragment): JsFragment {
    // define fragments for stand-alone if nodes
    if (nodeHasDirective(node, 'if')) {
        return createFragment(code, node, fragments, 'create_if_block');
    }

    return fragment;
}

/**
 * Process conditional elements.
 * 
 * @param  {JsCode}     code 
 * @param  {ParsedNode} node
 * @param  {JsFragment} fragment 
 * @return {void}
 */
export function processElement(code: JsCode, node: ParsedNode, fragment: JsFragment): void {
    // @todo: handle conditionals on the fragment root
    // @todo: handle if blocks that have sibling else-if/else nodes
    processStandAloneIfBlocks(code, node, fragment);
}

/**
 * Process stand-alone if blocks.
 * 
 * @param  {JsCode}     code 
 * @param  {ParsedNode} node
 * @param  {JsFragment} fragment 
 * @return {void}
 */
function processStandAloneIfBlocks(code: JsCode, node: ParsedNode, fragment: JsFragment): void {
    // @todo
}