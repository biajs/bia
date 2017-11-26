import parseTemplate from './template';
import { validateOptions } from './validate';
import { CompileOptions } from '../interfaces';

/**
 * Parse a single file component.
 * 
 * @param source
 */
export function parse(source: string, options: CompileOptions) {
    try {
        validateOptions(options);
    } catch (err) {
        throw err;
    }

    return {
        template: parseTemplate(source, options),
    };
}