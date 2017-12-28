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
export function process(code: JsCode, node: ParsedNode, fragment: JsFragment): void {
    if (fragment.rootNode === node) {
        manageRootElement(code, node, fragment); // <- should this be it's own processor?
    }
}

export function postProcess(code: JsCode, node: ParsedNode, fragment: JsFragment): void {
    if (fragment.rootNode === node) {
        returnRootElement(code, node, fragment);
    }
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

    // define a variable for the dom element
    fragment.define(el);

    // create the root element
    code.useHelper(createElement);
    fragment.create.append(`${el} = createElement('${tagName}');`);

    // if the node has purely static text, append that to it
    if (
        !node.hasDynamicChildren 
        && node.children.length === 1 
        && node.children[0].type === 'TEXT'
    ) {
        code.useHelper(setText);
        fragment.create.append(`setText(${el}, '${escape(node.children[0].textContent)}');`);
    }

    // if the element has purely static children, set the inner html
    else if (
        !node.hasDynamicChildren
    ) {
        fragment.create.append(`${el}.innerHTML = '${escape(node.innerHTML)}';`);
    }

    // mount the root element
    code.useHelper(insertNode);
    fragment.mount.append(`insertNode(${el}, target, anchor);`);

    // unmount the root element
    code.useHelper(detachNode);
    fragment.unmount.append(`detachNode(${el});`);
}

function returnRootElement(code, node, fragment) {
    const tagName = node.tagName.toLowerCase();
    const el = fragment.getVariableName(node, tagName);

    fragment.create.append(`return ${el};`);
}