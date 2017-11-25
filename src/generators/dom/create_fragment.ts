import { 
    JsIf,
    JsCode,
    JsFunction,
    JsObject,
    JsVariable,
} from '../classes/index';

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
            `return ${fragmentFunctionsObject(template)};`,
        ]
    });
}

/**
 * Hydrate the node if neccessary.
 * 
 * @param  {Object} node
 * @return {Object} 
 */
function addHydrationCall(node) {
    if (nodeRequiresHydration(node)) {
        return new JsCode({
            content: [
                `this.h();`,
            ],
        });
    }
}

/**
 * Create a dom element.
 */
function createElement(node, varName) {
    return new JsCode({
        content: [
            `div = createElement('div');`
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
 * @param  {Object}
 */
function fragmentFunctionsObject(node) {
    // this will eventually hold create, destroy, mount, and unmount
    return new JsObject({
        properties: {
            c: getCreateFn(node),
            h: getHydrateFn(node),
            m: getMountFn(node),
        },
    });
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
 * @param {Object} node
 * @return {Object} 
 */
function getHydrateFn(node) {
    // if the node doesn't need hydration, use noop
    if (!nodeRequiresHydration(node)) {
        return new JsCode({ content: ['noop'] });
    }

    // otherwise, return our hydration fn
    const content = [];

    // attach any classes our element has
    if (typeof node.attributes.class !== 'undefined') {
        content.push(`div.className = "${escapeJavascriptString(node.attributes.class)}";`);
    }

    // attach inline styles
    // @todo: refactor and move this logic to a global helper fn
    if (typeof node.attributes.style !== 'undefined') {
        node.attributes.style.split(';').forEach((style) => {
            const delimeterPosition = style.indexOf(':');
            const property = escapeJavascriptString(style.slice(0, delimeterPosition).trim());
            const value = escapeJavascriptString(style.slice(delimeterPosition + 1).trim());

            if (property.length && value.length) {
                content.push(`div.style.setProperty('${property}', '${value}')`);
            }
        });
    }

    return new JsFunction({ content });
}

/**
 * Function to insert a fragment into the dom.
 * 
 * @param  {Object} node
 * @return {Object} 
 */
function getMountFn(node) {
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
 * @param  {Object} node
 * @return {boolean}
 */
function nodeRequiresHydration(node): boolean {
    return Object.keys(node.attributes).length > 0;
}

/**
 * If a component has child elements, set it's inner html.
 */
function setInnerHTML(node, varName) {
    const hasChildElements = node.children.length > 0
        && node.children.find(child => child.type === 'ELEMENT');

    if (hasChildElements) {
        return new JsCode({
            content: [
                `${varName}.innerHTML = '${escapeJavascriptString(node.innerHTML)}';`,
            ],
        });
    }
}

/**
 * Set the text content directly if a node only has child text.
 */
function setTextContent(node, varName: string) {
    if (node.children.length === 1 && node.children[0].type === 'TEXT') {
        const { textContent } = node.children[0];

        return new JsCode({
            content: [
                `${varName}.textContent = '${escapeJavascriptString(textContent)}';`,
            ],
        });
    }
}