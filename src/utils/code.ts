import { ParsedNode } from '../interfaces';
import { isElementNode, isTextNode } from './parsed_node';
const falafel = require('falafel');

// find root identifiers in source code
export function findRootIdentifiers(src: string) {
    const rootIdentifiers = [];

    walkRootIdentifiers(src, (node) => rootIdentifiers.push(node.name));

    return rootIdentifiers;
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