import { parse } from './parse/parse';
import generateCode from './generators/dom/dom';

/**
 * Compile source code into a component.
 * 
 * @param source 
 * @param options
 */
export function compile(source: string, options: any) {
    try {
        const parsedSource = parse(source, options);
        const code = generateCode(parsedSource, options);

        return {
            code,
        };
    } catch (err) {
        throw err;
    }
}