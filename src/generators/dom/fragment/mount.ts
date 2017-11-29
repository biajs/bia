import { ParsedNode, TextInterpolation } from '../../../interfaces';
import { VariableNamer } from '../../../utils/code';
import { escapeJsString } from '../../../utils/string';
import { nodeHasDirective, nodeRequiresHydration } from '../../../utils/parsed_node';

import { 
    JsCode,
    JsFunction,
    JsIf,
    JsObject,
    JsReturn,
    JsVariable,
} from '../../classes/index';

/**
 * Function to insert a fragment into the dom.
 * 
 * @param  {ParsedNode}     node
 * @param  {Array<NodeVar>} nodeVars
 * @return {JsFunction} 
 */
export default function (node: ParsedNode, nodeNamer: VariableNamer): JsFunction {
    const rootVarName = nodeNamer.getName(node);

    const content: Array<JsCode|string> = [
        `replaceNode(target, ${rootVarName});`,
    ];

    content.push(appendChildElements(node, nodeNamer));

    return new JsFunction({
        name: 'mount',
        signature: ['target'],
        content,
    });
}

/**
 * Recursively append child elements to their parent.
 * 
 * @param  {ParsedNode}     node 
 * @param  {Array<NodeVar>} nodeVars
 * @return {JsCode} 
 */
function appendChildElements(node: ParsedNode, nodeNamer: VariableNamer): JsCode {
    const content = [];
    const varName = nodeNamer.getName(node);

    if (node.hasDynamicChildren) {
        node.children.forEach(child => {
            const childVarName = nodeNamer.getName(child);

            if (node.type === 'ELEMENT') {
                content.push(`${varName}.appendChild(${childVarName});`);
            }

            content.push(appendChildElements(child, nodeNamer));
        });
    }

    return new JsCode({
        content,
    });
}