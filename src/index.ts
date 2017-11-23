import { parse } from './parse/parse';
import createComponent from './generators/dom';


/**
 * Compile source code into a component.
 * 
 * @param source 
 * @param options
 */
function compile(source: string) {
    try {
        const parsedSource = parse(source);
        const createComponent = createComponent(parsedSource);

        return {
            createComponent,
            parsedSource,
        };
    } catch (err) {
        throw err;
    }
}

export { createComponent, parse };