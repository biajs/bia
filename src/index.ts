import { parse } from './parse/index';

/**
 * Compile source code into a component.
 * 
 * @param source 
 * @param options
 */
function compile(source: string) {
    parse(source);
}

export { compile, parse };