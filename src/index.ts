import { parse } from './parse/parse';
import compileDomCode from './compilers/dom/dom';

/**
 * Compile source code into a component.
 * 
 * @param {string} source 
 * @param {Object} options
 */
export function compile(source: string, options: any) {
    try {
        const parsedSource = parse(source, options);
        const code = compileDomCode();

        return {
            code,
        };
    } catch (err) {
        throw err;
    }
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