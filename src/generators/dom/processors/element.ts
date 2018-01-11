import { JsCode } from '../../code/index';
import { JsFragment } from '../functions/JsFragment';
import { DomProcessor, JsFragmentNode, ParsedNode } from '../../../interfaces';

//
// utils
//
import { escape } from '../../../utils/string';

import { 
    hasConditionalDirective, 
    hasLoopDirective,
    hasOnlyStaticContent,
    hasOnlyStaticText,
    hasProcessingFlag,
    isElementNode, 
    isTextNode,
    setProcessingFlag,
    walkNodeTree,
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

//
// process dom elements
//
export function process(code: JsCode, currentNode: ParsedNode, fragment: JsFragment) {
    // root element
    if (currentNode === fragment.rootNode) {
        manageRootElement(code, currentNode, fragment);
    }

    // static elements
    else if (
        isElementNode(currentNode) && 
        !hasLoopDirective(currentNode) &&
        !hasConditionalDirective(currentNode) &&
        !hasProcessingFlag(currentNode, 'wasCreatedByInnerHTML')
    ) {
        manageStaticElement(code, currentNode, fragment);
    }
};

//
// post-process dom elements
//
export function postProcess(code: JsCode, currentNode: ParsedNode, fragment: JsFragment) {
    // hydrate the fragment if neccessary, and return the root element
    if (currentNode === fragment.rootNode) {
        hydrateFragment(code, currentNode, fragment);
        returnRootElement(code, currentNode, fragment);
    }
};

//
// add a call to hydrate the current fragment
//
function hydrateFragment(code: JsCode, node: ParsedNode, fragment: JsFragment) {
    if (!fragment.hydrate.isEmpty()) {
        fragment.create.append('this.h();');
    }
}

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

        // set a flag to prevent other processors from creating a text node
        setProcessingFlag(node.children[0], 'wasCreatedBySetText');
    }

    // if the element has purely static children, set the inner
    else if (hasOnlyStaticContent(node)) {
        fragment.create.append(`${el}.innerHTML = '${escape(node.innerHTML)}';`);

        // set a flag on the tree to prevent other processors from creating elements
        walkNodeTree(node, n => setProcessingFlag(n, 'wasCreatedByInnerHTML'));
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

        // set a flag on the text node so we don't re-process it
        setProcessingFlag(node.children[0], 'wasCreatedBySetText');
    }

    // set purely static inner html if that's all we have
    else if (hasOnlyStaticContent(node)) {
        fragment.create.append(`${varName}.innerHTML = '${escape(node.innerHTML)}';`);

        // set a flag on all descendent nodes so we don't re-process them
        walkNodeTree(node, n => setProcessingFlag(n, 'wasCreatedByInnerHTML'));
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