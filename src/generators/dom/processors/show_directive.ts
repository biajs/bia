import { JsCode } from '../../code/index';
import { JsFragment } from '../functions/JsFragment';
import { DomProcessor, JsFragmentNode, ParsedNode } from '../../../interfaces';

//
// utils
//
import { namespaceRootIdentifiers } from '../../../utils/code';
import { getDirective, nodeHasDirective } from '../../../utils/parsed_node';

//
// helpers
//
import { toggleVisibility } from '../helpers/index';

/**
 * Process the current node.
 * 
 * @param  {JsCode}                 code
 * @param  {ParsedNode}             currentNode
 * @param  {Array<JsFragmentNode>}  fragments 
 */
export function process(code: JsCode, currentNode: ParsedNode, fragment: JsFragment) {
    const directive = getDirective(currentNode, 'show');

    if (directive) {
        const varName = fragment.getVariableName(currentNode);

        code.useHelper(toggleVisibility);

        fragment.hydrate.append(`toggleVisibility(${varName}, ${namespaceRootIdentifiers(directive.expression)});`);
    }
};