const { JSDOM } = require('jsdom');
// const { nodeTypes } = require('../utils/constants');
import { nodeTypes } from '../utils/constants';

/**
 * Parse a template.
 * 
 * @param template 
 */
export default function(source: string, options) {
    const { document } = new JSDOM(source).window;
    const templates = document.querySelectorAll('template');

    if (templates.length === 0) {
        throw `Failed to parse ${options.filename}, no template block is defined.`;
    } else if (templates.length > 1) {
        throw `Failed to parse ${options.filename}, only one template block may be defined.`;
    }
    
    const template = document.querySelector('template').content;

    if (template.childElementCount !== 1) {
        throw `Failed to parse ${options.filename}, template must contain exactly one root element.`;
    }

    return createDomTree(template.children[0]);
}

function createDomTree(el) {
    const nodeType = nodeTypes[el.nodeType];
    const textContent = getTextContentIfTextNode(el, nodeType);

    return {
        tagName: el.tagName,
        textContent: textContent,
        type: nodeType,
        children: Array.from(el.childNodes).map(createDomTree),
    };
}

// get the text content of a node, or null if it's not a text node
function getTextContentIfTextNode(el, nodeType) {
    return nodeType === 'TEXT' ? el.textContent : null;
}