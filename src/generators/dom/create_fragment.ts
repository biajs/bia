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
    setClass,
    setStyle,
} from './global_functions';

import { 
    escapeJsString,
} from '../../utils/string';

/**
 * Build up a functions to control a dom fragment.
 * 
 * @param  {string}         fnName
 * @param  {ParsedNode}     node
 * @return {JsFunction}
 */
export function createFragment(fnName: string, node: ParsedNode): JsFunction {
    return new JsFunction({
        signature: ['vm', 'state'],
        name: fnName,
        content: [
            // create containers for each of our dom elements
            defineFragmentVariables(node),
            null,

            // return an object with methods to control our dom fragment
            new JsReturn({ 
                value: fragmentFunctionsObject(node)
            }),
        ],
    });
}

/**
 * Hydrate the node if neccessary.
 * 
 * @param  {ParsedNode}     node
 * @return {JsCode} 
 */
function addHydrationCall(node: ParsedNode): JsCode {
    return new JsCode({
        content: [
            `this.h();`,
        ],
    });
}

/**
 * Attach classes to a node.
 * 
 * @param  {ParsedNode}     node
 * @return {JsCode}
 */
function attachClasses(node: ParsedNode) {
    const content = [];
    const globalFunctions = [];

    // start with all of our static classes that we know will be attached
    if (node.staticClasses.length) {
        const classes = node.staticClasses.slice(0);

        content.push(`setClass(div, '${escapeJsString(classes.join(' '))}')`);
        globalFunctions.push(setClass());
    }

    // @todo: handle dynamic classes
    
    return new JsCode({
        content,
        globalFunctions,
    });
}

/**
 * Attach data attributes to a node.
 * 
 * @param  {ParsedNode}     node
 * @return {JsCode}
 */
function attachDataAttributes(node: ParsedNode) {
    const attrNames = Object.keys(node.dataAttributes);

    if (attrNames.length > 0) {
        const content = attrNames.map(name => {
            return `div.dataset.${name} = '${escapeJsString(node.dataAttributes[name])}'`
        });

        return new JsCode({ content });
    }
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
        const property = escapeJsString(styleProperty);
        const value = escapeJsString(node.staticStyles[styleProperty]);

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
 * Create a node's child elements
 * 
 * @param  {ParsedNode}     node
 * @return {JsCode}
 */
function createChildElements(node: ParsedNode): JsCode {
    let childId = 0;
    let textId = 0;
    const content = [];

    for (let child of node.children) {
        const varName = typeof child.tagName === 'string'
            ? escapeJsString(child.tagName.toLowerCase())
            : 'text';

        content.push(`${varName}_${++childId} = createElement('${varName}');`);
    }

    return new JsCode({
        content,
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
            `${varName} = createElement('${escapeJsString(node.tagName.toLowerCase())}');`,
        ],
    });
}

/**
 * Define the variables neccessary to build a dom fragment.
 * 
 * @param  {ParsedNode}     node
 * @return {JsVariable}
 */
function defineFragmentVariables(node: ParsedNode) {
    return new JsVariable({
        define: [
            node.tagName.toLowerCase(),
        ],
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
 * @param  {ParsedNode}     node
 * @return {JsFunction}
 */
function getCreateFn(node: ParsedNode): JsFunction {
    const varName = 'div';

    const content = [
        createElement(node, varName),
    ];

    // if the node contains purely static content we can
    // save ourselves some hassle by just setting it.
    if (node.hasDynamicChildren) {
        content.push(setInnerHTML(node, varName));
        content.push(setTextContent(node, varName));
    }

    // otherwise if our node contains purely static content,
    // we can save ourselves some hassly by just setting it
    else {
        content.push(createChildElements(node));
    }

    // hydrate our fragment if needed
    if (nodeRequiresHydration(node)) {
        content.push(addHydrationCall(node));
    }

    // set our root element to vm.$el
    content.push(storeVmElement(varName));

    return new JsFunction({
        name: 'c',
        content,
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
        attachDataAttributes(node),
        attachStyles(node),
    ];

    return new JsFunction({
        name: 'h',
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
 * @return {JsCode}
 */
function setInnerHTML(node: ParsedNode, varName: string): JsCode {
    const content = [];

    const hasChildElements = node.children.length > 0
        && node.children.find(child => child.type === 'ELEMENT');

    if (hasChildElements) {
        const innerHTML = interpolateText(node.innerHTML, node.textInterpolations);

        content.push(`${varName}.innerHTML = '${escapeJsString(innerHTML)}';`);
    }

    return new JsCode({
        content,
    });
}

/**
 * Set the text content directly if a node only has child text.
 * 
 * @param  {ParsedNode}     node
 * @param  {string}         varName
 * @return {JsCode}
 */
function setTextContent(node: ParsedNode, varName: string): JsCode {
    const content = [];

    if (node.children.length === 1 && node.children[0].type === 'TEXT') {
        const textNode = node.children[0];
        const textContent = interpolateText(textNode.textContent, textNode.textInterpolations);
        
        content.push(`${varName}.textContent = '${escapeJsString(textContent)}';`);
    }

    return new JsCode({
        content,
    });
}

/**
 * 
 * @param  {string}     varName
 * @return {JsCode}
 */
function storeVmElement(varName: string): JsCode {
    return new JsCode({
        content: [
            `vm.$el = ${varName};`,
        ],
    });
}