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
import { getDirective, nodeHasDirective, nodeRequiresHydration } from '../../../utils/parsed_node';

/**
 * Build up a functions to control a dom fragment.
 * 
 * @param  {string}         fnName
 * @param  {ParsedNode}     node
 * @return {JsFunction}
 */
export function createFragment(fnName: string, node: ParsedNode): JsFunction {
    // name all nodes in our tree
    const nodeNamer = new VariableNamer;
    nameAllNodes(node, nodeNamer);

    // return our create fragment function
    return new JsFunction({
        signature: ['vm'],
        name: fnName,
        content: [
            // define variables for each of our fragment's dom nodes
            defineDomNodes(node, nodeNamer),
            null,

            // define if blocks
            defineIfBlocks(node, nodeNamer),
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

function defineDomNodes(node: ParsedNode, nodeNamer: VariableNamer): JsVariable {
    return new JsVariable({ 
        define: nodeNamer.namedNodes
            .filter(n => !nodeHasDirective(n.node, 'if'))
            .map(n => n.name),
    });
}

function defineIfBlocks(node: ParsedNode, nodeNamer: VariableNamer) {
    const descendentIfNodes = getDescendentIfNodes(node);

    // define a fragment function for each if block
    const ifFragmentConstructors = descendentIfNodes.map(ifNode => {
        const name = nodeNamer.getName(ifNode);

        return createFragment(`create_${name}`, ifNode);
    });

    // and add code to construct our fragment based on the condition
    const ifNodeDefinitions = descendentIfNodes.map(ifNode => {
        const name = nodeNamer.getName(ifNode);
        const directive = getDirective(ifNode, 'if');

        const value = `(${directive.expression}) && create_${name}(vm)`;

        return new JsVariable({ name, value });
    });

    return new JsCode({
        globalFunctions: ifFragmentConstructors,
        content: ifNodeDefinitions,
    });
}

function getDescendentIfNodes(node: ParsedNode) {
    let ifNodes = [];

    node.children.forEach(child => {
        if (nodeHasDirective(child, 'if')) {
            ifNodes.push(child);
        } else {
            ifNodes = ifNodes.concat(getDescendentIfNodes(child));
        }        
    });

    return ifNodes;
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
