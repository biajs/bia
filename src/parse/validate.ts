import { CompileOptions } from '../interfaces';
import { directivePrefix } from '../utils/constants';
import { elementHasDirective, isElementNode, isTextNode } from '../utils/dom';

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

    validateElseNodes(template);
}

/**
 * Validate that else blocks are preceeded by if blocks.
 * 
 * @param  {DocumentFragment} template
 * @return {void} 
 * @throws {string}
 */
function validateElseNodes(template: DocumentFragment): void {
    const elseBlocks = Array.from(template.querySelectorAll(`[${directivePrefix}else]`));
    const elseIfBlocks = Array.from(template.querySelectorAll(`[${directivePrefix}else-if]`));

    elseBlocks.concat(elseIfBlocks).forEach(el => {
        let prevNodeIsValid = false;
        let prevNode = el.previousSibling;

        while (prevNode) {
            // make sure there isn't text content between the if/else branches
            if (isTextNode(prevNode) && prevNode.textContent.trim().length > 0) {
                throw `Text content may not appear between if/else branches.`;
            }

            // make sure the previous element is valid
            if (elementHasDirective(prevNode, 'if') || elementHasDirective(prevNode, 'else-if')) {
                prevNodeIsValid = true;
                break;
            }

            prevNode = prevNode.previousSibling;
        }

        // if our previous node is not valid, throw an error
        if (!prevNodeIsValid) {
            throw `Elements with "${directivePrefix}else" directives may only appear directly following elements with "${directivePrefix}if" or "${directivePrefix}else-if" directives.`;
        }
    });
}