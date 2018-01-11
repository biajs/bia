import { JsCode } from '../../code/index';
import { JsFragment } from '../functions/JsFragment';
import { DomProcessor, JsFragmentNode, NodeDirective, ParsedNode } from '../../../interfaces';

//
// helpers
//
import { 
    appendNode, 
    createText,
} from '../helpers/index';

//
// utils
//
import {
    namespaceIdentifiers,
} from '../../../utils/code';

import {
    hasProcessingFlag ,
    hasTextInterpolations,
    isTextNode,
} from '../../../utils/parsed_node';

import {
    escape,
    splitTextInterpolations,
} from '../../../utils/string';

/**
 * Process the current node.
 * 
 * @param  {JsCode}                 code
 * @param  {ParsedNode}             currentNode
 * @param  {Array<JsFragmentNode>}  fragments 
 */
export function process(code: JsCode, currentNode: ParsedNode, fragment: JsFragment) {
    // do nothing if the current node isn't a text node or was already created
    if (
        !isTextNode(currentNode) ||
        hasProcessingFlag(currentNode, 'wasCreatedBySetText') ||
        hasProcessingFlag(currentNode, 'wasCreatedByInnerHTML')
    ) {
        return;
    }

    // otherwise split the text so we process dynamic and static parts
    splitTextInterpolations(currentNode.textContent).forEach(text => {

        // when naming these text variables, we need to clone the current node
        // object so they each get a unique identifier. this is neccessary
        // because one node might have both static and dynamic content.
        const varName = fragment.getVariableName({ ...currentNode }, 'text');
        const parentVarName = fragment.getVariableName(currentNode.parent);

        // define
        fragment.define(varName);

        // create
        code.useHelper(createText);
        
        if (text.startsWith('{{')) {
            // dynamic text
            const expression = text.slice(2, -2).trim();
            fragment.create.append(`${varName} = createText(${namespaceIdentifiers(expression, 'vm', fragment.scope)});`);
        } else {
            // static text
            fragment.create.append(`${varName} = createText('${escape(text)}');`);
        }

        // mount
        code.useHelper(appendNode);
        fragment.mount.append(`appendNode(${varName}, ${parentVarName});`);
    });
}