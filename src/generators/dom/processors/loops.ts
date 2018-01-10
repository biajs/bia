import { JsCode } from '../../code/index';
import { JsFragment } from '../functions/JsFragment';
import { DomProcessor, JsFragmentNode, NodeDirective, ParsedNode } from '../../../interfaces';
import { createFragment } from '../dom';

//
// utils
//
import {
    namespaceIdentifiers,
} from '../../../utils/code';

import { 
    getDirective, 
    getNextElementNode, 
    getPreviousElementNode,
    nodeHasDirective, 
    removeProcessedDirective,
} from '../../../utils/parsed_node';

import {
    indent,
} from '../../../utils/string';

/**
 * Create child fragments.
 * 
 * @param  {JsCode}                 code
 * @param  {ParsedNode}             currentNode
 * @param  {Array<JsFragmentNode>}  fragments 
 */
export function createChildFragments(code: JsCode, currentNode: ParsedNode, fragments: Array<JsFragmentNode>, fragment: JsFragment) {
    // do nothing if our node doesn't have a for directive
    if (!nodeHasDirective(currentNode, 'for')) return;

    // remove the directive so nobody else processes it
    const directive = getDirective(currentNode, 'for');
    removeProcessedDirective(currentNode, directive);

    // create our for block with a unique name, and add it to the function scope
    const parsedExpression = parseLoopExpression(directive);
    const blockName = code.getVariableName(currentNode, 'for_block');
    const scope = fragment.scope.slice(0);

    scope.push(parsedExpression.source, parsedExpression.key);

    if (parsedExpression.index) {
        scope.push(parsedExpression.index);
    }

    return createFragment(code, currentNode, fragments, `create_${blockName}`, scope);
}

/**
 * Process the current node.
 * 
 * @param  {JsCode}                 code
 * @param  {ParsedNode}             currentNode
 * @param  {Array<JsFragmentNode>}  fragments 
 */
export function process(code: JsCode, currentNode: ParsedNode, fragment: JsFragment) {
    // do nothing if our node doesn't have a for directive
    if (!nodeHasDirective(currentNode, 'for')) return;

    const directive = getDirective(currentNode, 'for');
    const blockName = code.getVariableName(currentNode, 'for_block');
    const parentEl = fragment.getVariableName(currentNode.parent);
    const createBlockName = `create_${blockName}`;

    // parse the loop expression
    const parsedExpression = parseLoopExpression(directive);
    const namespacedSource = namespaceIdentifiers(parsedExpression.source);
    const fragmentSignature = ['vm', ...fragment.scope, namespacedSource, `${namespacedSource}[i]`];

    if (parsedExpression.index) {
        fragmentSignature.push(parsedExpression.index);
    }

    // constructor
    fragment.code.append(`var ${blockName} = [];`);
    fragment.code.append(`for (var i = 0, len = ${namespacedSource}.length; i < len; i++) {`);
    fragment.code.append(indent(`${blockName}[i] = ${createBlockName}(${fragmentSignature.join(', ')});`));
    fragment.code.append(`}`);

    // create
    fragment.create.append(`for (var i = 0, len = ${blockName}.length; i < len; i++) ${blockName}[i].c();`);

    // mount
    fragment.mount.append(`for (var i = 0, len = ${blockName}.length; i < len; i++) ${blockName}[i].m(${parentEl}, null);`);
}

// parse the loop expression
// for="person in people" -> { key: 'person', index: null, source: 'people' }
// @todo: for="(person, index) in people" -> { key: 'person', index: 'index', source: 'people' }
function parseLoopExpression(directive: NodeDirective) {
    const index = null;
    const [key, source] = directive.expression.split(' in ');

    return { key, source, index };
}