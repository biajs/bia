import { JsCode } from '../../code/index';
import { JsFragment } from '../functions/JsFragment';
import { ParsedNode } from '../../../interfaces';

//
// utils
//
import { escape } from '../../../utils/string';
import { isTextNode, hasProcessingFlag } from '../../../utils/parsed_node';

//
// helpers
//
import { appendNode, createText } from '../helpers/index';

//
// process static text nodes
//
export function process(code: JsCode, currentNode: ParsedNode, fragment: JsFragment) {
    // do nothing if this text node was already created
    if (
        !isTextNode(currentNode) ||
        hasProcessingFlag(currentNode, 'wasCreatedBySetText') ||
        hasProcessingFlag(currentNode, 'wasCreatedByInnerHTML')
    ) {
        return;
    }

    const varName = fragment.getVariableName(currentNode, 'text');
    const parentVarName = fragment.getVariableName(currentNode.parent);

    // define
    fragment.define(varName);

    // create
    code.useHelper(createText);
    fragment.create.append(`${varName} = createText('${escape(currentNode.textContent)}');`);

    // mount
    code.useHelper(appendNode);
    fragment.mount.append(`appendNode(${varName}, ${parentVarName});`);
};