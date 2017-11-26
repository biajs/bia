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
            createElement(),
            null,
            replaceNode(),
            null,
            noop(),
        ],
    });
}

/**
 * Create element.
 * 
 * @param  {string}     tagName
 * @return {Object}
 */
function createElement() {
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