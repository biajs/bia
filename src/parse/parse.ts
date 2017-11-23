import parseTemplate from './template';

/**
 * Parse a single file component.
 * 
 * @param source
 */
export function parse(source: string, options) {
    return {
        template: parseTemplate(source, options),
    };
}