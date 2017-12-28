import { JsCode } from '../../code/index';
import { JsFragment } from '../fragment/JsFragment';
import { DomProcessor, JsFragmentNode, ParsedNode } from '../../../interfaces';

//
// utils
//
import { escape } from '../../../utils/string';

//
// helpers
//
import { 
    createElement,
    detachNode,
    insertNode,
    setText,
} from '../helpers/index';

/**
 * Create child fragments.
 * 
 * @param  {JsCode}                 code
 * @param  {ParsedNode}             currentNode
 * @param  {Array<JsFragmentNode>}  fragments 
 */
export function createChildFragments(code: JsCode, currentNode: ParsedNode, fragments: Array<JsFragmentNode>) {
    //
};

/**
 * Process the current node.
 * 
 * @param  {JsCode}                 code
 * @param  {ParsedNode}             currentNode
 * @param  {Array<JsFragmentNode>}  fragments 
 */
export function process(code: JsCode, node: ParsedNode, fragment: JsFragment) {
    // manage the lifecycle of a fragment's root element
    if (fragment.rootNode === node) {
        manageRootElement(code, node, fragment);
    }
};

/**
 * Process the current node after all child processors are complete.
 * 
 * @param  {JsCode}                 code
 * @param  {ParsedNode}             currentNode
 * @param  {Array<JsFragmentNode>}  fragments 
 */
export function postProcess(code: JsCode, node: ParsedNode, fragment: JsFragment) {
    if (fragment.rootNode === node) {
        returnRootElement(code, node, fragment);
    }
};

//
// manage the root element of a fragment
// 
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

//
// return the root element from a fragment's create method
//
function returnRootElement(code: JsCode, node: ParsedNode, fragment: JsFragment) {
    const tagName = node.tagName.toLowerCase();
    const el = fragment.getVariableName(node, tagName);

    fragment.create.append(`return ${el};`);
}