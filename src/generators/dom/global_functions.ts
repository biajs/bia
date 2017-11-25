import {
    JsIf,
    JsCode,
    JsFunction,
    JsObject,
    JsVariable,
} from '../classes';

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
            insertNode(),
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
function insertNode() {
    return new JsFunction({
        id: 'insertNode',
        name: 'insertNode',
        signature: ['node', 'target'],
        content: [
            `target.insertBefore(node);`,
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