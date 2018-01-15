import { parse } from './parse/parse';
import generateCode from './generators/dom/dom';

/**
 * Compile source code into a component.
 * 
 * @param {string} source 
 * @param {Object} options
 */
export function compile(source: string, options: any) {
    const parsedSource = parse(source, options);
    // const code = generateCode(parsedSource, options);

    return {
        // code,
    };
}

/**
 * Compile source code into a component, and return it.
 * 
 * @param {string} source 
 * @param {Object} options 
 */
export function create(source: string, options: any) {
    try {
        const { code } = compile(source, {
            ...options,
            format: 'fn',
        });

        return new Function(code)();
    } catch (err) {
        throw err;
    }
}