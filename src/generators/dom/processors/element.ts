import { JsCode } from '../../code/index';
import { JsFragment } from '../fragment/JsFragment';
import { ParsedNode } from '../../../interfaces';

import { 
    createElement,
    detachNode,
    insertNode,
} from '../helpers/index';

/**
 * Process dom elements.
 * 
 * @param  {JsCode}     code 
 * @param  {ParsedNode} node
 * @param  {JsFragment} fragment 
 * @return {void}
 */
export default function (code: JsCode, node: ParsedNode, fragment: JsFragment): void {
    manageRootElement(code, node, fragment);
}

/**
 * Manage the root element of a fragment.
 * 
 * @param  {JsCode}     code 
 * @param  {ParsedNode} node 
 * @param  {JsFragment} fragment 
 */
function manageRootElement(code: JsCode, node: ParsedNode, fragment: JsFragment) {
    const tagName = node.tagName.toLowerCase();
    const el = fragment.getVariableName(node, tagName);

    // define a variable for the dom
    fragment.define(el);

    // create the root element
    code.useHelper(createElement);
    fragment.create.append(`${el} = createElement("${tagName}");`);

    // return the root element from the create function
    fragment.create.append(`return ${el};`);

    // mount the root element
    code.useHelper(insertNode);
    fragment.mount.append(`insertNode(${el}, target, anchor);`);

    // unmount the root element
    code.useHelper(detachNode);
    fragment.unmount.append(`detachNode(${el});`);
}