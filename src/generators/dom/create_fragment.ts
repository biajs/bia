import { 
    ParsedNode,
    TextInterpolation,
} from '../../interfaces';

import { 
    JsCode,
    JsFunction,
    JsIf,
    JsObject,
    JsReturn,
    JsVariable,
} from '../classes/index';

import {
    setStyle,
} from './global_functions';

import { escapeJavascriptString } from '../../utils/string';

/**
 * Build up a functions to control a dom fragment.
 * 
 * @param {Object} template
 */
export default function(name: string, template) {
    return new JsFunction({
        signature: ['vm', 'state'],
        name: name,
        content: [
            // create containers for each of our dom elements
            defineFragmentVariables(template),
            null,

            // return an object with methods to control our dom fragment
            new JsReturn({ value: fragmentFunctionsObject(template) }),
        ],
    });
}

/**
 * Hydrate the node if neccessary.
 * 
 * @param  {ParsedNode}     node
 * @return {void|JsCode} 
 */
function addHydrationCall(node: ParsedNode) {
    if (nodeRequiresHydration(node)) {
        return new JsCode({
            content: [
                `this.h();`,
            ],
        });
    }
}

/**
 * Attach classes to a node.
 * 
 * @param  {ParsedNode}     node
 * @return {JsCode}
 */
function attachClasses(node: ParsedNode) {
    // start with all of our static classes that we know will be attached
    const classes = node.staticClasses.slice(0);

    // @todo: handle dynamic classes

    return new JsCode({
        content: [
            `div.className = '${escapeJavascriptString(classes.join(' '))}';`,
        ]
    });
}

/**
 * Attach styles to a node.
 * 
 * @param  {ParsedNode}     node
 * @return {JsCode}
 */
function attachStyles(node: ParsedNode) {
    // start with all of our static styles that we know will be attached
    const styles = Object.keys(node.staticStyles).reduce((content, styleProperty) => {
        const property = escapeJavascriptString(styleProperty);
        const value = escapeJavascriptString(node.staticStyles[styleProperty]);

        content.push(`setStyle(div, '${property}', '${value}');`);

        return content;
    }, []);

    // @todo: handle dynamic styles

    // attach our setStyle function if neccessary
    const globalFunctions = styles.length
        ? [setStyle()]
        : [];
    
    return new JsCode({
        globalFunctions,
        content: styles,
    });
}

/**
 * Create a dom element.
 * 
 * @param  {ParsedNode}     node
 * @param  {varName}        string
 * @return {JsCode}
 */
function createElement(node: ParsedNode, varName: string) {
    return new JsCode({
        content: [
            `div = createElement('div');`,
            `vm.$el = div;`
        ],
    });
}

/**
 * Define the variables neccessary to build a dom fragment.
 * 
 * @param  {Object} template
 * @return {Object}
 */
function defineFragmentVariables(template) {
    return new JsVariable({
        define: [template.tagName.toLowerCase()],
    });
}

/**
 * Define the functions neccessary to build a dom fragment.
 * 
 * @param  {ParsedNode}     node
 * @return {JsObject}
 */
function fragmentFunctionsObject(node: ParsedNode): JsObject {
    // this will eventually hold create, destroy, mount, and unmount
    return new JsObject({
        id: 'OBJECTTTTTTT',
        properties: {
            c: getCreateFn(node),
            h: getHydrateFn(node),
            m: getMountFn(node),
        },
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
 * Function to create a new dom fragment.
 * 
 * @param  {Object} node
 * @return {Object}
 */
function getCreateFn(node) {
    return new JsFunction({
        name: 'c',
        content: [
            createElement(node, 'div'),
            setTextContent(node, 'div'),
            setInnerHTML(node, 'div'),
            addHydrationCall(node),
            null,
            `return div;`,
        ],
    });
}

/**
 * Function to hydrate a node's dom elements.
 * 
 * @param  {ParsedNode}     node
 * @return {JsFunction} 
 */
function getHydrateFn(node: ParsedNode): JsCode {
    // if the node doesn't need hydration, use noop
    if (!nodeRequiresHydration(node)) {
        return new JsCode({ content: ['noop'] });
    }

    // otherwise, return our hydration fn
    const content = [
        attachClasses(node),
        attachStyles(node),
    ];

    return new JsFunction({
        content,
    });
}

/**
 * Function to insert a fragment into the dom.
 * 
 * @param  {ParsedNode}     node
 * @return {JsFunction} 
 */
function getMountFn(node: ParsedNode): JsFunction {
    return new JsFunction({
        name: 'm',
        signature: ['target'],
        content: [
            `replaceNode(target, div);`,
        ],
    });
}

/**
 * Determine if a node requires hydration or not.
 * 
 * @param  {ParsedNode}     node
 * @return {boolean}
 */
function nodeRequiresHydration(node: ParsedNode): boolean {
    return Object.keys(node.attributes).length > 0;
}

/**
 * If a component has child elements, set it's inner html.
 * 
 * @param  {ParsedNode}     node
 * @param  {string}         varName
 * @return {JsCode|void}
 */
function setInnerHTML(node: ParsedNode, varName: string): JsCode|void {
    const hasChildElements = node.children.length > 0
        && node.children.find(child => child.type === 'ELEMENT');

    if (hasChildElements) {
        const innerHTML = interpolateText(node.innerHTML, node.textInterpolations);

        return new JsCode({
            content: [
                `${varName}.innerHTML = '${escapeJavascriptString(innerHTML)}';`,
            ],
        });
    }
}

/**
 * Set the text content directly if a node only has child text.
 * 
 * @param  {ParsedNode}     node
 * @param  {string}         varName
 * @return {JsCode|void}
 */
function setTextContent(node: ParsedNode, varName: string): JsCode|void {
    if (node.children.length === 1 && node.children[0].type === 'TEXT') {
        const textNode = node.children[0];

        const textContent = interpolateText(textNode.textContent, textNode.textInterpolations);

        return new JsCode({
            content: [
                `${varName}.textContent = '${escapeJavascriptString(textContent)}';`,
            ],
        });
    }
}