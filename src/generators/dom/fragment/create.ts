import { VariableNamer } from '../../../utils/code';
import { escapeJsString } from '../../../utils/string';
import { nodeHasDirective, nodeRequiresHydration } from '../../../utils/parsed_node';
import { ParsedNode, TextInterpolation } from '../../../interfaces';

import { 
    JsCode,
    JsFunction,
    JsIf,
    JsObject,
    JsReturn,
    JsVariable,
} from '../../classes/index';

import {
    createElement,
    createText,
    setClass,
    setStyle,
} from './../global_functions';

/**
 * Function to create a new dom fragment.
 * 
 * @param  {ParsedNode}     node
 * @param  {Array<NodeVar>} nodeVars
 * @return {JsFunction}
 */
export default function(node: ParsedNode, nodeNamer: VariableNamer): JsFunction {
    const varName = nodeNamer.getName(node);

    const content = [
        createDomElements(node, nodeNamer),
    ];

    // hydrate our fragment if needed
    if (nodeRequiresHydration(node)) {
        content.push(
            new JsCode({ content: [`this.h();`] })
        );
    }

    // set our root element to vm.$el
    content.push(
        new JsCode({ content: [`vm.$el = ${varName};`] })
    );

    return new JsFunction({
        name: 'create',
        content,
    });
}

/**
 * Recursively create a node's dom elements.
 * 
 * @param  {ParsedNode}     node
 * @param  {Array<NodeVar>} nodeVars
 * @return {JsCode} 
 */
function createDomElements(node: ParsedNode, nodeNamer: VariableNamer): JsCode {
    const content = [];
    const varName = nodeNamer.getName(node);

    // elements
    if (node.type === 'ELEMENT') {
        const tagName = node.tagName.toLowerCase();
        content.push(setElementVar(node, varName));
    
        // if the node contains dynamic children, we'll create
        // dom elements for each one before hydrating them.
        if (node.hasDynamicChildren) {
            const childElements = node.children.map(child => createDomElements(child, nodeNamer));
    
            content.push(...childElements);
        }
    
        // otherwise if our node contains purely static content,
        // we can save ourselves some hassl by just setting it.
        else content.push(setStaticContent(node, varName));
    }

    // text
    else if (node.type === 'TEXT') {
        content.push(setTextVar(node, varName));
    }

    return new JsCode({
        content,
    });
}



/**
 * Interpolate text.
 * 
 * @param  {string}                     rawText
 * @param  {Array<TextInterpolation>}   interpolations 
 * @return {string}
 */
function interpolateText(rawText: string, interpolations: Array<TextInterpolation>): string {
    let text = '';

    try {
        text = interpolations.reduce((text, interpolation) => {
            const interpolate = new Function(`return (${interpolation.expression})`);

            return text.replace(interpolation.text, interpolate());
        }, rawText)
    } catch (err) {
        // @todo handle invalid expressions inside text interpolations
        throw err;
    }

    return text;
}

/**
 * Set an element variable.
 * 
 * @param  {ParsedNode}     node
 * @param  {varName}        string
 * @return {JsCode}
 */
function setElementVar(node: ParsedNode, varName: string) {
    return new JsCode({
        globalFunctions: [
            createElement(),
        ],
        content: [
            `${varName} = createElement('${escapeJsString(node.tagName.toLowerCase())}');`,
        ],
    });
}

/**
 * Set the text or inner html of a purely static node.
 * 
 * @param  {ParsedNode}     node
 * @param  {string}         varName
 * @return {JsCode}
 */
function setStaticContent(node: ParsedNode, varName: string): JsCode {
    const content = [];

    // set content for static text nodes
    if (node.children.length === 1 && node.children[0].type === 'TEXT') {
        const textNode = node.children[0];
        const textContent = interpolateText(textNode.textContent, textNode.textInterpolations);

        content.push(`${varName}.textContent = '${escapeJsString(textContent)}';`);
    }

    // or if there are child elements, set inner html
    else {
        const hasChildElements = node.children.length > 0
            && node.children.find(child => child.type === 'ELEMENT');

        if (hasChildElements) {
            const innerHTML = interpolateText(node.innerHTML, node.textInterpolations);
            
            content.push(`${varName}.innerHTML = '${escapeJsString(innerHTML)}';`);
        }
    }

    return new JsCode({
        content,
    });
}

/**
 * Set an text node variable.
 * 
 * @param  {ParsedNode}     node
 * @param  {varName}        string
 * @return {JsCode}
 */
function setTextVar(node: ParsedNode, varName: string) {
    return new JsCode({
        globalFunctions: [
            createText(),
        ],
        content: [
            `${varName} = createText('${escapeJsString(node.textContent)}');`,
        ],
    });
}