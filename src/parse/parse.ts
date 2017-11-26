import parseTemplate from './template';
import { validateCompileOptions } from './validate';
import { CompileOptions } from '../interfaces';

/**
 * Parse a single file component.
 * 
 * @param source
 */
export function parse(source: string, options: CompileOptions) {
    try {
        validateCompileOptions(options);
    } catch (err) {
        throw err;
    }

    return {
        template: parseTemplate(source, options),
    };
}