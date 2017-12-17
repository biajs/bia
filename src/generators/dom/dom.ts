import { JsCode } from '../code/index';
import { CompileOptions, ParsedSource } from '../../interfaces';
import generateConstructor from './constructor/constructor';

/**
 * Compile a component into code to be run in the browser.
 * 
 * @return {string}
 */
export default function(source: ParsedSource, options: CompileOptions) {
    const code = new JsCode;

    // create a constructor function for the component
    const constructor = generateConstructor(options);

    code.append(constructor);

    // create fragment tree
    // include helpers that were used
    // include version comment
    
    // finally, return our source code
    return code.toString();
}