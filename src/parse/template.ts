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

    return {
        tagName: el.tagName,
        type: nodeTypes[el.nodeType],
        children: Array.from(el.childNodes).map(createDomTree),
    };
}