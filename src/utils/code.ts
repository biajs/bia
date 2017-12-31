import { ParsedNode } from '../interfaces';
import { isElementNode, isTextNode } from './parsed_node';
import { BaseCode } from '../generators/code/BaseCode';
const falafel = require('falafel');

// determine if an object is a code instance
export function isCodeInstance(obj) {
    return obj instanceof BaseCode;
}

// attach a namespace to free variables in a bit of source code
export function namespaceIdentifiers(src: string, namespace: string = 'vm') {
    return String(falafel(src, (node) => {
        if (node.type === 'Identifier') {
            node.update(`${namespace}.${node.source()}`);
        }
    }));
}