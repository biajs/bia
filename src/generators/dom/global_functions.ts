import {
    JsIf,
    JsCode,
    JsFunction,
    JsObject,
    JsVariable,
} from '../classes/index';

/**
 * These functions will be defined globally.
 * 
 * @return {Object}
 */
export default function() {
    return new JsCode({
        content: [
            replaceNode(),
            null,
            noop(),
        ],
    });
}

/**
 * Create element.
 * 
 * @return {Object}
 */
export function createElement() {
    return new JsFunction({
        id: 'createElement',
        name: 'createElement',
        signature: ['tag'],
        content: [
            `return document.createElement(tag);`,
        ],
    });
}

/**
 * Create text node.
 * 
 * @return {Object}
 */
export function createText() {
    return new JsFunction({
        id: 'createText',
        name: 'createText',
        signature: ['text'],
        content: [
            `return document.createTextNode(text);`,
        ],
    });
}

/**
 * Interpolate text.
 * 
 * @return {JsFunction}
 */
export function interpolate() {
    return new JsFunction({
        id: 'interpolate',
        name: 'interpolate',
        signature: ['vm', 'expression'],
        content: [
            `return new Function('return 5')()`,
        ]
    });
}

/**
 * Insert a dom node before a target.
 * 
 * @return {Object}
 */
function replaceNode() {
    return new JsFunction({
        id: 'replaceNode',
        name: 'replaceNode',
        signature: ['target', 'node'],
        content: [
            `target.replaceWith(node);`,
        ],
    });
}

/**
 * No operation.
 * 
 * @return {Object}
 */
function noop() {
    return new JsFunction({
        name: 'noop',
        id: 'noop',
    });
}

/**
 * Set an element's classes.
 * 
 * @return {JsFunction}
 */
export function setClass() {
    return new JsFunction({
        id: 'setClass',
        name: 'setClass',
        signature: ['el', 'className'],
        content: [
            `el.className = className;`,
        ],
    });
}

/**
 * Set a style on an element.
 * 
 * @return {JsFunction}
 */
export function setStyle() {
    return new JsFunction({
        id: 'setStyle',
        name: 'setStyle',
        signature: ['el', 'name', 'value'],
        content: [
            `el.style.setProperty(name, value);`,
        ],
    });
}