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

// find the next element node
export function getNextElementNode(node: ParsedNode) {
    if (node.parent) {
        const index = node.parent.children.indexOf(node);
        
        return node.parent.children[index + 1];
    }
}

// determine if a node has a conditional
export function hasConditionalDirective(node: ParsedNode): boolean {
    return nodeHasDirective(node, 'if')
        || nodeHasDirective(node, 'else-if')
        || nodeHasDirective(node, 'else');
}

// determine if a node only contains static text
export function hasOnlyStaticText(node: ParsedNode): boolean {
    return !node.hasDynamicChildren 
        && node.children.length === 1 
        && node.children[0].type === 'TEXT';
}

// determine if a node has a processing flag
export function hasProcessingFlag(node: ParsedNode, flag: string): boolean {
    return node.processingData[flag] === true;
}

// determine if a node has a particular directive
export function nodeHasDirective(node: ParsedNode, directive: string): boolean {
    return isElementNode(node) && node.directives.some(d => d.name === directive);
}

// determine if a node will require hydration or not
export function nodeRequiresHydration(node: ParsedNode): boolean {
    return node.hasDynamicChildren || Object.keys(node.attributes).length > 0;
}

// remove a directive from a node that has already been processed
export function removeProcessedDirective(node: ParsedNode, directive: NodeDirective) {
    node.directives = node.directives.filter(nodeDirective => nodeDirective !== directive);

    return node;
}

// set a processing flag on a node
export function setProcessingFlag(node: ParsedNode, flag: string): void {
    node.processingData[flag] = true;
}

// recursively process a node and it's children
export function walkNodeTree(node: ParsedNode, fn: Function): void {
    const p = n => { fn(n); n.children.forEach(p) }    
    p(node);
}