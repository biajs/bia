import { directivePrefix } from './constants';

/**
 * Determine if an element has a particular directive.
 * 
 * @param  {Node}       node
 * @param  {string}     directive
 * @return {boolean}
 */
export function elementHasDirective(node: Node, directive: string): boolean {
    // @ts-ignore
    return isElementNode(node) && node.hasAttributes(`${directivePrefix}${directive}`);
}

/**
 * Determine if a dom node is a comment.
 * 
 * @param  {Node}       node
 * @return {boolean} 
 */
export function isCommentNode(node: Node): boolean {
    return node.nodeType === 8;
}

/**
 * Determine if a dom node is an element.
 * 
 * @param  {Node}       node
 * @return {boolean} 
 */
export function isElementNode(node: Node): boolean {
    return node.nodeType === 1;
}

/**
 * Determine if a dom node is text.
 * 
 * @param  {Node}       node
 * @return {boolean} 
 */
export function isTextNode(node: Node): boolean {
    return node.nodeType === 3;
}