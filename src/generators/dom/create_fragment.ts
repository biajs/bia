import { 
    NodeVar,
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
    const nodeVars = getNodeVars(node);

    return new JsFunction({
        signature: ['vm', 'state'],
        name: fnName,
        content: [
            // create containers for each of our dom elements
            defineFragmentVariables(nodeVars),
            null,

            // return an object with methods to control our dom fragment
            new JsReturn({ 
                value: fragmentFunctionsObject(node, nodeVars)
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
 * @param  {string}         varName
 * @return {JsCode}
 */
function attachClasses(node: ParsedNode, varName: string) {
    const content = [];
    const globalFunctions = [];

    // start with all of our static classes that we know will be attached
    if (node.staticClasses.length) {
        const classes = node.staticClasses.slice(0);

        content.push(`setClass(${varName}, '${escapeJsString(classes.join(' '))}')`);
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
 * @param  {string}         varName
 * @return {JsCode}
 */
function attachDataAttributes(node: ParsedNode, varName: string) {
    const attrNames = Object.keys(node.dataAttributes);

    if (attrNames.length > 0) {
        const content = attrNames.map(name => {
            return `${varName}.dataset.${name} = '${escapeJsString(node.dataAttributes[name])}'`
        });

        return new JsCode({ content });
    }
}

/**
 * Attach styles to a node.
 * 
 * @param  {ParsedNode}     node
 * @param  {string}         varName
 * @return {JsCode}
 */
function attachStyles(node: ParsedNode, varName: string) {
    // start with all of our static styles that we know will be attached
    const styles = Object.keys(node.staticStyles).reduce((content, styleProperty) => {
        const property = escapeJsString(styleProperty);
        const value = escapeJsString(node.staticStyles[styleProperty]);

        content.push(`setStyle(${varName}, '${property}', '${value}');`);

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
 * Recursively create a node's dom elements.
 * 
 * @param  {ParsedNode}     node
 * @param  {Array<NodeVar>} nodeVars
 * @return {JsCode} 
 */
function createDomElements(node: ParsedNode, nodeVars: Array<NodeVar>): JsCode {
    const tagName = node.tagName.toLowerCase();
    const varName = getVarName(node, nodeVars);

    const content: Array<string|JsCode> = [
        `${varName} = createElement('${tagName}');`
    ];

    // if the node contains dynamic children, we'll create
    // dom elements for each one before hydrating them.
    if (node.hasDynamicChildren) {
        content.push(...node.children.map(child => createDomElements(child, nodeVars)));
    }

    // otherwise if our node contains purely static content,
    // we can save ourselves some hassl by just setting it.
    else {
        content.push(setStaticContent(node, varName));
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
 * @param  {Array<NodeVar>}     nodeVars
 * @return {JsVariable}
 */
function defineFragmentVariables(nodeVars: Array<NodeVar>) {
    return new JsVariable({
        define: nodeVars.map(v => v.name),
    });
}

/**
 * Define the functions neccessary to build a dom fragment.
 * 
 * @param  {ParsedNode}     node
 * @param  {Array>NodeVar>} nodeVars
 * @return {JsObject}
 */
function fragmentFunctionsObject(node: ParsedNode, nodeVars: Array<NodeVar>): JsObject {
    // this will eventually hold create, destroy, mount, and unmount
    return new JsObject({
        properties: {
            c: getCreateFn(node, nodeVars),
            h: getHydrateFn(node, nodeVars),
            m: getMountFn(node, nodeVars),
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
 * @param  {Array<NodeVar>} nodeVars
 * @return {JsFunction}
 */
function getCreateFn(node: ParsedNode, nodeVars: Array<NodeVar>): JsFunction {
    const varName = getVarName(node, nodeVars);

    const content = [
        createDomElements(node, nodeVars),
    ];

    // hydrate our fragment if needed
    if (nodeRequiresHydration(node)) {
        content.push(addHydrationCall(node));
    }

    // set our root element to vm.$el
    content.push(storeVmElement(varName));

    return new JsFunction({
        name: 'create',
        content,
    });
}

/**
 * Function to hydrate a node's dom elements.
 * 
 * @param  {ParsedNode}     node
 * @param  {Array<NodeVar>} nodeVars
 * @return {JsFunction} 
 */
function getHydrateFn(node: ParsedNode, nodeVars: Array<NodeVar>): JsCode {
    // if the node doesn't need hydration, use noop
    if (!nodeRequiresHydration(node)) {
        return new JsCode({ content: ['noop'] });
    }

    // hydrate our root node
    const rootVarName = getVarName(node, nodeVars);

    const content = [
        attachClasses(node, rootVarName),
        attachDataAttributes(node, rootVarName),
        attachStyles(node, rootVarName),
    ];

    // hydrate child nodes
    node.children.forEach(child => {
        const childVarName = getVarName(child, nodeVars);

        if (child.type === 'ELEMENT') {
            content.push(
                attachClasses(child, childVarName),
                attachDataAttributes(child, childVarName),
                attachStyles(child, childVarName),
            )
        }
    });

    return new JsFunction({
        name: 'hydrate',
        content,
    });
}

/**
 * Function to insert a fragment into the dom.
 * 
 * @param  {ParsedNode}     node
 * @param  {Array<NodeVar>} nodeVars
 * @return {JsFunction} 
 */
function getMountFn(node: ParsedNode, nodeVars: Array<NodeVar>): JsFunction {
    const rootVarName = getVarName(node, nodeVars);

    const content = [
        `replaceNode(target, ${rootVarName});`,
    ];

    // append any of our root node's children
    if (node.hasDynamicChildren) {
        node.children.forEach(child => {
            const childVarName = getVarName(child, nodeVars);

            if (node.type === 'ELEMENT') {
                content.push(`${rootVarName}.appendChild(${childVarName});`);
            }
        });
    }

    return new JsFunction({
        name: 'mount',
        signature: ['target'],
        content,
    });
}

/**
 * Give each node in the tree a unique var name.
 * 
 * @param  {ParsedNode}     node
 * @return {Array<NodeVar} 
 */
function getNodeVars(node: ParsedNode): Array<NodeVar> {
    const nodeVars = [
        { node, name: 'root' },
    ];

    if (node.hasDynamicChildren) {
        const names = {};
        
        node.children.forEach(child => {
            if (child.type === 'ELEMENT') {
                const tagName = child.tagName.toLowerCase();

                if (typeof names[tagName] === 'undefined') {
                    names[tagName] = 0;
                }

                nodeVars.push({ name: `${tagName}_${names[tagName]++}`, node: child });
            }
        }, []);
    }

    return nodeVars;
}

/**
 * Get a node's variable name.
 * 
 * @param  {ParsedNode}     node 
 * @param  {Array<NodeVar>} nodeVars 
 * @return {string}
 */
function getVarName(node: ParsedNode, nodeVars: Array<NodeVar>): string {
    const nodeVar = nodeVars.find(nv => nv.node === node);

    return nodeVar ? nodeVar.name : 'unknown';
}

/**
 * Determine if a node requires hydration or not.
 * 
 * @param  {ParsedNode}     node
 * @return {boolean}
 */
function nodeRequiresHydration(node: ParsedNode): boolean {
    return node.hasDynamicChildren || Object.keys(node.attributes).length > 0;
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