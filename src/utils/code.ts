import { ParsedNode } from '../interfaces';
import { isElementNode, isTextNode } from './parsed_node';
import { JsCode } from '../generators/code/index';
import { BaseCode } from '../generators/code/BaseCode';
import { JsConditional } from '../generators/dom/functions/JsConditional';
const falafel = require('falafel');

// find the conditional for a particular node
export function findConditionalWithNode(code: JsCode, node: ParsedNode): JsConditional|undefined {
    // @ts-ignore
    return code.content.find((line) => {
        // @ts-ignore
        return isCodeInstance(line) && line.getClassName() === 'JsConditional' && line.hasBranch(node);
    });
}

// determine if an object is a code instance
export function isCodeInstance(obj) {
    return obj instanceof BaseCode;
}

// attach a namespace to free variables in a bit of source code
export function namespaceIdentifiers(src: string, namespace: string = 'vm', ignore: Array<string> = []) {
    return String(falafel(src, (node) => {
        if (node.type === 'Identifier' && ignore.indexOf(node.source()) === -1) {
            node.update(`${namespace}.${node.source()}`);
        }
    }));
}