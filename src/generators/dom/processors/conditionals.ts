import { JsCode } from '../../code/index';
import { JsFragment } from '../fragment/JsFragment';
import { JsFragmentNode, ParsedNode } from '../../../interfaces';
import { escape } from '../../../utils/string';

import { createFragment } from '../dom';

import { 
    getDirective,
    nodeHasDirective, 
    removeProcessedDirective,
} from '../../../utils/parsed_node';

import { 
    //
} from '../helpers/index';

/**
 * Define fragment.
 * 
 * @param  {JsCode}                 code 
 * @param  {ParsedNode}             node
 * @param  {Array<JsFragmentNode>}  fragments
 * @return {JsFragment|void}
 */
export function defineFragment(code: JsCode, node: ParsedNode, fragments: Array<JsFragmentNode>): JsFragment|undefined {
    const directive = getDirective(node, 'if');

    // define fragments for stand-alone if nodes
    if (directive) {
        removeProcessedDirective(node, directive);

        return createFragment(code, node, fragments, 'create_if_block');
    }

    return;
}

/**
 * Process conditional elements.
 * 
 * @param  {JsCode}     code 
 * @param  {ParsedNode} node
 * @param  {JsFragment} fragment 
 * @return {void}
 */
export function process(code: JsCode, node: ParsedNode, fragment: JsFragment): void {
    // @todo: handle conditionals on the fragment root
    // @todo: handle if blocks that have sibling else-if/else nodes
    const directive = getDirective(node, 'if');

    if (directive) {
        processStandAloneIfBlocks(code, node, fragment);
    }
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
    fragment.create.append('// create if block');
}