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
import getHydrateFn from './hydrate';
import getMountFn from './mount';

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

    // name all nodes in our tree
    nameAllNodes(node, nodeNamer);

    // return our create fragment function
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
                        h: getHydrateFn(node, nodeNamer),
                        m: getMountFn(node, nodeNamer),
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
