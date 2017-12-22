import { JsCode } from '../../code/index';
import { JsFragment } from '../fragment/JsFragment';
import { ParsedNode } from '../../../interfaces';
import { escape } from '../../../utils/string';

import { 
    createElement,
    detachNode,
    insertNode,
    setText,
} from '../helpers/index';

/**
 * Process dom elements.
 * 
 * @param  {JsCode}     code 
 * @param  {ParsedNode} node
 * @param  {JsFragment} fragment 
 * @return {void}
 */
export function processElement(code: JsCode, node: ParsedNode, fragment: JsFragment): void {
    if (fragment.rootNode === node) {
        const tagName = node.tagName.toLowerCase();
        const el = fragment.getVariableName(node, tagName);
        
        fragment.create.append('// return element');
    }
}