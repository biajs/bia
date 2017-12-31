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
// import { } from '../helpers/index';

//
// process static text nodes
//
export function process(code: JsCode, currentNode: ParsedNode, fragment: JsFragment) {
    if (
        isElementNode(currentNode) &&
        !hasProcessingFlag(currentNode, 'wasCreatedByInnerHTML') &&
        currentNode.staticClasses.length > 0
    ) {
        const varName = fragment.getVariableName(currentNode);
        const classes = currentNode.staticClasses.join(' ');

        // @todo: determine if it's worth using a helper here
        fragment.hydrate.append(`${varName}.className = '${escape(classes)}';`);
    }
};