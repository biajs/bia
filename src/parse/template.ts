const { JSDOM } = require('jsdom');
import { nodeTypes } from '../utils/constants';
import { NodeType, ParsedNode, CompileOptions } from '../interfaces';
import { validateTemplate } from './validate';

interface ElementAttribute {
    name: string,
    value: string,
}

/**
 * Parse a template.
 * 
 * @param template 
 */
export default function(source: string, options: CompileOptions) {
    const { document } = new JSDOM(source).window;

    validateTemplate(document, options);
    
    const template = document.querySelector('template').content;

    return createDomTree(template.children[0]);
}

// convert an element to a parsed node tree
function createDomTree(el: HTMLElement): ParsedNode {
    const nodeType = nodeTypes[el.nodeType];

    return {
        attributes: getAttributes(el),
        children: Array.from(el.childNodes).map(createDomTree),
        dataAttributes: getDataAttributes(el),
        innerHTML: getInnerHTML(el),
        staticClasses: getStaticClasses(el),
        staticStyles: getStaticStyles(el),
        tagName: getTagName(el),
        textContent: getTextContent(el, nodeType),
        textInterpolations: getInterpolations(el, nodeType),
        type: nodeType,
    };
}

// get the attributes of a node as an object
// <div foo="bar" /> => { foo: 'bar' }
function getAttributes(el: HTMLElement): Object {
    return Array.from(el.attributes || []).reduce((attributes, attr: ElementAttribute) => {
        attributes[attr.name] = attr.value;
        return attributes;
    }, {});
}

// get the data attributes of a node as an object
// <div data-foo="bar" data-one-two="three" /> -> { foo: 'bar', oneTwo: 'three' }
function getDataAttributes(el: HTMLElement): Object {
    return {...el.dataset};
}

// get an element's inner html
// <div><span>foo</span></div> -> '<span>foo</span>'
function getInnerHTML(el: HTMLElement): string {
    return el.innerHTML;
}

// get the interpolations of a text node
// {{ foo }} -> [{ expression: 'foo', text: '{{ foo }}' }]
function getInterpolations(el: HTMLElement, nodeType: NodeType): Array<any> {
    const textContent = nodeType === 'TEXT'
        ? el.textContent
        : el.innerHTML;

    return (textContent.match(/\{\{.*?}}/g) || []).map(text => {
        const expression = text.slice(2, text.length - 2).trim();

        return { expression, text };
    });
}

// get an element's static classes
// <div class="foo bar" /> -> ['foo', 'bar']
function getStaticClasses(el: HTMLElement): Array<string> {
    return el.classList 
        ? Array.from(el.classList) 
        : [];
}

// get an element's static styles
// <div style="color: red" /> -> { color: 'red' }
function getStaticStyles(el: HTMLElement): Object {
    // text nodes have no style
    if (!el.style) {
        return {};
    }

    const { cssText } = el.style;

    // @todo: throw an error if interpolation happens here

    return cssText.split(';')
        .map(style => style.trim())
        .filter(style => style.length)
        .reduce((styles, style) => {
            const delimeterPosition = style.indexOf(':');
            const property = style.slice(0, delimeterPosition).trim();
            const value = style.slice(delimeterPosition + 1).trim();

            styles[property] = value;

            return styles;
        }, {});
}

// get an element's tagName, or null if there is none
// <div /> => 'div'
function getTagName(el: HTMLElement): string | null {
    return el.tagName || null;
}

// get the text content of a node, or null if it's not a text node
function getTextContent(el: HTMLElement, nodeType): string | null {
    return nodeType === 'TEXT' ? el.textContent : null;
}