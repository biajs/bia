import { CompileOptions } from '../interfaces';

/**
 * Validate compile options.
 * 
 * @params {}
 */
export function validateCompileOptions(options: CompileOptions): CompileOptions {
    if (typeof options.filename !== 'string') {
        throw 'Failed to compile component, no filename was not defined.';
    }

    if (typeof options.name !== 'string') {
        throw `Failed to compile ${options.name}, no component name was defined.`;
    }

    return options
}