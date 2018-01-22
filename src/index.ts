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
        const code = compileDomCode(parsedSource, options);

        return {
            code,
        };
    } catch (err) {
        throw err;
    }
}