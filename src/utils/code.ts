import { ParsedNode } from '../interfaces';
import { isElementNode, isTextNode } from './parsed_node';
const falafel = require('falafel');

// find an expression's dependencies
export function findExpressionDependencies(src: string) {
    const deps = {};
    const rawDeps = [];

    falafel(src, node => {
        if (isIdentifier(node)) {
            if (isObjectProp(node)) {
                const parentSource = node.parent.source();
                // static: foo.bar
                // computed: foo[bar]
                rawDeps.push(isComputedProp(node)
                    ? rawDeps.push(parentSource.slice(0, -node.name.length - 2) + `[${node.name}]`)
                    : parentSource.slice(0, -node.name.length) + node.name
                );
            } 
            
            // non-obj identifier: foo
            else rawDeps.push(node.name);
        } 
        
        // literal: foo['bar']
        else if (isLiteral(node) && isObjectProp(node)) {
            rawDeps.push(node.parent.source());
        }
    });

    console.log(rawDeps);

    return rawDeps;
}

// find root identifiers in source code
export function findRootIdentifiers(src: string) {
    const rootIdentifiers = [];

    walkRootIdentifiers(src, (node) => rootIdentifiers.push(node.name));

    return rootIdentifiers;
}

// acorn node helpers
export function isComputedProp(node) {
    return isObjectProp(node) && node.parent.computed;
}

export function isIdentifier(node) {
    return node && node.type === 'Identifier';
}

export function isLiteral(node) {
    return node && node.type === 'Literal';
}

export function isLogicalExpression(node) {
    return node && node.type === 'LogicalExpression';
}

export function isMemberExpression(node) {
    return node && node.type === 'MemberExpression'
}

export function isObjectProp(node) {
    return isMemberExpression(node.parent) && node.parent.property === node;
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
    return falafel(src, (node) => {
        if (isIdentifier(node) && !isObjectProp(node)) {
            fn(node);
        }
    });
}