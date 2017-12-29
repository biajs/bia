import { JsCode } from '../../code/index';
import { JsFragment } from '../fragment/JsFragment';
import { DomProcessor, JsFragmentNode, ParsedNode } from '../../../interfaces';

//
// utils
//
import { escape } from '../../../utils/string';

import { 
    hasConditionalDirective, 
    hasOnlyStaticText,
    isElementNode, 
    nodeHasProcessingFlag,
} from '../../../utils/parsed_node';

//
// helpers
//
import { 
    appendNode,
    createElement,
    detachNode,
    insertNode,
    setText,
} from '../helpers/index';

/**
 * Process the current node.
 * 
 * @param  {JsCode}                 code
 * @param  {ParsedNode}             currentNode
 * @param  {Array<JsFragmentNode>}  fragments 
 */
export function process(code: JsCode, currentNode: ParsedNode, fragment: JsFragment) {
    // manage the lifecycle of a fragment's root element
    if (currentNode === fragment.rootNode) {
        manageRootElement(code, currentNode, fragment);
    }

    // otherwise create static elements
    else if (
        isElementNode(currentNode) && 
        !hasConditionalDirective(currentNode) &&
        !nodeHasProcessingFlag(currentNode, 'wasCreatedByInnerHTML')
    ) {
        manageStaticElement(code, currentNode, fragment);
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
    // return the root element from our create function
    if (currentNode === fragment.rootNode) {
        returnRootElement(code, currentNode, fragment);
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
    if (hasOnlyStaticText(node)) {
        code.useHelper(setText);
        fragment.create.append(`setText(${el}, '${escape(node.children[0].textContent)}');`);
    }

    // if the element has purely static children, set the inner html
    else if (!node.hasDynamicChildren) {
        fragment.create.append(`${el}.innerHTML = '${escape(node.innerHTML)}';`);

        // set a flag on all child nodes so we don't process them again
        const setFlag = (n) => {
            n.processingData.wasCreatedByInnerHTML = true;
            n.children.forEach(setFlag);
        }

        setFlag(node);
    }

    // mount the root element
    code.useHelper(insertNode);
    fragment.mount.append(`insertNode(${el}, target, anchor);`);

    // unmount the root element
    code.useHelper(detachNode);
    fragment.unmount.append(`detachNode(${el});`);
}

//
// manage static elements
//
function manageStaticElement(code: JsCode, node: ParsedNode, fragment: JsFragment) {
    const tagName = node.tagName.toLowerCase();
    const varName = fragment.getVariableName(node, tagName);
    const parentVarName = fragment.getVariableName(node.parent);

    fragment.define(varName);

    // create the root element
    code.useHelper(createElement);
    fragment.create.append(`${varName} = createElement('${tagName}');`);

    // attach purely static text if that's all we have
    if (hasOnlyStaticText(node)) {
        code.useHelper(setText);
        fragment.create.append(`setText(${varName}, '${escape(node.children[0].textContent)}');`);
    }

    // mount
    code.useHelper(appendNode);
    fragment.mount.append(`appendNode(${varName}, ${parentVarName});`)
}

//
// return the root element from a fragment's create method
//
function returnRootElement(code: JsCode, node: ParsedNode, fragment: JsFragment) {
    const tagName = node.tagName.toLowerCase();
    const el = fragment.getVariableName(node, tagName);

    fragment.create.append(`return ${el};`);
}