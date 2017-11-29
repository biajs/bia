import { NodeDirective, ParsedNode } from '../interfaces';

// determine if a node is an element
export function isElementNode(node: ParsedNode): boolean {
    return node.type === 'ELEMENT';
}

// determine if a node is text
export function isTextNode(node: ParsedNode): boolean {
    return node.type === 'TEXT';
}

// get a directive from a node
export function getDirective(node: ParsedNode, directive: string): NodeDirective | undefined {
    return node.directives.find(d => d.name === directive);
}

// determine if a node has a particular directive
export function nodeHasDirective(node: ParsedNode, directive: string): boolean {
    return isElementNode(node) && node.directives.some(d => d.name === directive);
}