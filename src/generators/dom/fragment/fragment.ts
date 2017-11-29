import { 
    NodeVar,
    ParsedNode,
    TextInterpolation,
} from '../../../interfaces';

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

import getCreateFn from './create';

import { VariableNamer } from '../../../utils/code';
import { escapeJsString } from '../../../utils/string';
import { nodeHasDirective, nodeRequiresHydration } from '../../../utils/parsed_node';

/**
 * Build up a functions to control a dom fragment.
 * 
 * @param  {string}         fnName
 * @param  {ParsedNode}     node
 * @return {JsFunction}
 */
export function createFragment(fnName: string, node: ParsedNode): JsFunction {
    const nodeNamer = new VariableNamer;
    const varCounter = {};
    const nodeVars = getNodeVars(node, varCounter, true);

    // name all nodes in our tree
    nameAllNodes(node, nodeNamer);

    return new JsFunction({
        signature: ['vm'],
        name: fnName,
        content: [
            // define variables for each of our fragment's dom nodes
            new JsVariable({ 
                define: nodeNamer.namedNodes.map(n => n.name),
            }),

            null,

            // return an object with methods to manage our fragment
            new JsReturn({ 
                value: new JsObject({
                    properties: {
                        c: getCreateFn(node, nodeNamer),
                        h: getHydrateFn(node, nodeVars),
                        m: getMountFn(node, nodeVars),
                    },
                }),
            }),
        ],
    });
}

/**
 * Recursively name all the nodes in the tree.
 * 
 * @param  {ParsedNode}     node
 * @param  {VariableNamer}  nodeNamer
 * @param  {root}           isRoot
 * @return {void}
 */
function nameAllNodes(node: ParsedNode, nodeNamer: VariableNamer) {
    nodeNamer.getName(node, 'root');

    node.children.forEach(child => {
        if (nodeHasDirective(child, 'if')) {
            nodeNamer.getName(child, 'if_block');
        } else {
            nodeNamer.getName(child);
        }

        nameAllNodes(child, nodeNamer);
    });
}

/**
 * Recursively append child elements to their parent.
 * 
 * @param  {ParsedNode}     node 
 * @param  {Array<NodeVar>} nodeVars
 * @return {JsCode} 
 */
function appendChildElements(node: ParsedNode, nodeVars: Array<NodeVar>): JsCode {
    const content = [];
    const varName = getVarName(node, nodeVars);

    if (node.hasDynamicChildren) {
        node.children.forEach(child => {
            const childVarName = getVarName(child, nodeVars);

            if (node.type === 'ELEMENT') {
                content.push(`${varName}.appendChild(${childVarName});`);
            }

            content.push(appendChildElements(child, nodeVars));
        });
    }

    return new JsCode({
        content,
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

function hydrateDomElements(node, nodeVars) {
    const content = [];
    const varName = getVarName(node, nodeVars);

    if (node.type === 'ELEMENT') {
        content.push(
            attachClasses(node, varName),
            attachDataAttributes(node, varName),
            attachStyles(node, varName),
            ...node.children.map(child => hydrateDomElements(child, nodeVars)),
        );
    }

    return new JsCode({
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
        return new JsCode({ 
            content: ['noop'],
        });
    }

    return new JsFunction({
        name: 'hydrate',
        content: [
            hydrateDomElements(node, nodeVars),
        ],
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

    const content: Array<JsCode|string> = [
        `replaceNode(target, ${rootVarName});`,
    ];

    content.push(appendChildElements(node, nodeVars));

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
 * @param  {Object}         varCounter
 * @param  {boolean}        isFragmentRoot
 * @return {Array<NodeVar} 
 */
function getNodeVars(node: ParsedNode, varCounter: Object, isFragmentRoot: boolean = false): Array<NodeVar> {
    const nodeVars = [];

    // elements
    if (node.type === 'ELEMENT') {
        const tagName = node.tagName.toLowerCase();

        if (typeof varCounter[tagName] === 'undefined') {
            varCounter[tagName] = 0;
        }

        // add our node to the array of named node vars
        const name = isFragmentRoot ? 'root' : `${tagName}_${varCounter[tagName]++}`;
        nodeVars.push({ name, node });

        // recursively walk through child nodes and assign them names
        node.children.forEach(child => {
            nodeVars.push(...getNodeVars(child, varCounter));
        });
    }

    // text nodes
    if (node.type === 'TEXT') {
        if (typeof varCounter['text'] === 'undefined') {
            varCounter['text'] = 0;
        }

        const name = `text_${varCounter['text']++}`;
        nodeVars.push({ name, node });
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
