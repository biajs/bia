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

// find the previous element node
export function getPreviousElementNode(node: ParsedNode) {
    if (node.parent) {
        const index = node.parent.children.indexOf(node);

        return node.parent.children[index - 1];
    }
}

export function getPreviousNodeWithDirective(node: ParsedNode, directive: string) {
    if (node.parent) {
        const previousNodes = node.parent.children.slice(0, node.parent.children.indexOf(node));

        let i = previousNodes.length;

        while (i--) {
            if (nodeHasDirective(previousNodes[i], directive)) {
                return previousNodes[i];
            }
        }
    }
}

// determine if a node has a conditional
export function hasConditionalDirective(node: ParsedNode): boolean {
    return nodeHasDirective(node, 'if')
        || nodeHasDirective(node, 'else-if')
        || nodeHasDirective(node, 'else');
}

// determine if a node has a loop
export function hasLoopDirective(node: ParsedNode): boolean {
    return nodeHasDirective(node, 'for');
}

// determine if a node is completely static
export function hasOnlyStaticContent(node: ParsedNode): boolean {
    return !node.hasDynamicChildren
        && node.textInterpolations.length === 0
        && (!node.innerHTML || node.innerHTML.length > 0)
}

// determine if a node only contains static text
export function hasOnlyStaticText(node: ParsedNode): boolean {
    return !node.hasDynamicChildren 
        && node.textInterpolations.length === 0
        && node.children.length === 1 
        && node.children[0].type === 'TEXT';
}

// determine if a node has a processing flag
export function hasProcessingFlag(node: ParsedNode, flag: string): boolean {
    return node.processingData[flag] === true;
}

// determine if a node has text interpolations
export function hasTextInterpolations(node: ParsedNode): boolean {
    return node.textInterpolations.length > 0;
}

// determine if a node has a particular directive
export function nodeHasDirective(node: ParsedNode, ...directives: Array<string>): boolean {
    return isElementNode(node)
        && directives.filter(name => !!node.directives.find(d => d.name === name)).length > 0;
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