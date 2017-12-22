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
    manageRootElement(code, node, fragment); // <- should this be it's own processor?
}

/**
 * Manage the root element of a fragment.
 * 
 * @param  {JsCode}     code 
 * @param  {ParsedNode} node 
 * @param  {JsFragment} fragment 
 */
function manageRootElement(code: JsCode, node: ParsedNode, fragment: JsFragment) {
    if (fragment.rootNode === node) {
        const tagName = node.tagName.toLowerCase();
        const el = fragment.getVariableName(node, tagName);
    
        // define a variable for the dom
        fragment.define(el);
    
        // create the root element
        code.useHelper(createElement);
        fragment.create.append(`${el} = createElement("${tagName}");`);
    
        // if the node has purely static text, append that to it
        if (
            !node.hasDynamicChildren 
            && node.children.length === 1 
            && node.children[0].type === 'TEXT'
        ) {
            // @todo: determine if it's worth using a helper here...
            // code.useHelper(setText);
            // fragment.create.append(`setText(${el}, '${escape(node.children[0].textContent)}');`);
            fragment.create.append(`${el}.textContent = '${escape(node.children[0].textContent)}';`);
        }
    
        // if the element has purely static children, set the inner html
        else if (
            !node.hasDynamicChildren
        ) {
            fragment.create.append(`${el}.innerHTML = '${escape(node.innerHTML)}';`);
        }
    
        // // return the root element from the create function
        // fragment.create.append(`return ${el};`);
    
        // mount the root element
        code.useHelper(insertNode);
        fragment.mount.append(`insertNode(${el}, target, anchor);`);
    
        // unmount the root element
        code.useHelper(detachNode);
        fragment.unmount.append(`detachNode(${el});`);
    }
}