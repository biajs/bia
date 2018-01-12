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

// find root identifiers in source code
export function findRootIdentifiers(src: string) {
    const rootIdentifiers = [];

    walkRootIdentifiers(src, (node) => rootIdentifiers.push(node.name));

    return rootIdentifiers;
}

// determine if an object is a code instance
export function isCodeInstance(obj) {
    return obj instanceof BaseCode;
}

// attach a namespace to root identifiers in source code
export function namespaceRootIdentifiers(src: string, namespace: string = 'vm', ignore: Array<string> = []) {
    return String(walkRootIdentifiers(src, (node) => {
        if (ignore.indexOf(node.source()) === -1) {
            node.update(`${namespace}.${node.source()}`);
        }
    }));
}

// walk over the root identifiers in source code
export function walkRootIdentifiers(src: string, fn: Function) {
    const isIdentifier = n => n.type === 'Identifier';
    const isObjectProp = n => n.parent.type === 'MemberExpression' && n.parent.property === n;

    return falafel(src, (node) => {
        if (isIdentifier(node) && !isObjectProp(node)) {
            fn(node);
        }
    });
}