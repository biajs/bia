const { JSDOM } = require('jsdom');
// const { JSDOM } = require()

/**
 * Parse a single file component.
 * 
 * @param source
 */
export function parse(source: string, options) {
    const { document } = new JSDOM(source).window;
    const template = document.querySelectorAll('template');

    if (template.length === 0) {
        throw `Failed to parse ${options.filename}, no template block is defined.`;
    } else if (template.length > 1) {
        throw `Failed to parse ${options.filename}, only one template block may be defined.`;
    } else if (template.childElementCount !== 1) {
        throw `Failed to parse ${options.filename}, template must contain exactly one root element.`;
    }
}