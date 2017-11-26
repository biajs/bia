import { CompileOptions } from '../interfaces';

/**
 * Validate compile options.
 * 
 * @param   {CompileOptions}    options
 * @returns {CompileOptions}
 * @throws
 */
export function validateOptions(options: CompileOptions): CompileOptions {
    if (typeof options.filename !== 'string') {
        throw 'Failed to compile component, no filename was not defined.';
    }

    if (typeof options.name !== 'string') {
        throw `Failed to compile ${options.name}, no component name was defined.`;
    }

    return options
}

/**
 * Validate a template.
 * 
 * @param   {HTMLElement}       document
 * @param   {CompileOptions}    options
 * @returns {void}
 * @throws
 */
export function validateTemplate(document: HTMLElement, options: CompileOptions) {
    const templates = document.querySelectorAll('template');

    if (templates.length === 0) {
        throw `Failed to parse ${options.filename}, no template block is defined.`;
    }
    
    if (templates.length > 1) {
        throw `Failed to parse ${options.filename}, only one template block may be defined.`;
    }
    
    const template = document.querySelector('template').content;

    if (template.childElementCount !== 1) {
        throw `Failed to parse ${options.filename}, template must contain exactly one root element.`;
    }
}