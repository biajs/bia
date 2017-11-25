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
            // null,
            // noop(),
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