import { JsCode } from '../../code/index';
import { JsFragment } from '../functions/JsFragment';
import { ParsedNode } from '../../../interfaces';

//
// utils
//
import { escape } from '../../../utils/string';
import { isElementNode, hasProcessingFlag } from '../../../utils/parsed_node';

//
// helpers
//
import { setStyle } from '../helpers/index';

//
// process static text nodes
//
export function process(code: JsCode, currentNode: ParsedNode, fragment: JsFragment) {
    if (
        isElementNode(currentNode) &&
        !hasProcessingFlag(currentNode, 'wasCreatedByInnerHTML') &&
        Object.keys(currentNode.staticStyles).length > 0
    ) {
        const varName = fragment.getVariableName(currentNode);

        code.useHelper(setStyle);

        Object.keys(currentNode.staticStyles).forEach(key => {
            const value = currentNode.staticStyles[key];
            
            fragment.hydrate.append(`setStyle(${varName}, '${escape(key)}', '${escape(value)}');`);
        });
    }
};