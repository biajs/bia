import { JsCode, JsCodeOptions } from './JsCode';
import { indent } from '../../utils/string';

//
// Options
//
export interface JsFunctionOptions extends JsCodeOptions {
    name?: string|null;
    signature?: Array<string>;
    variables?: Array<string>;
}

//
// JsFunction
//
export class JsFunction extends JsCode {
    public name: string|null;
    public signature: Array<string>;
    public variables: Array<string>;

    /**
     * Constructor.
     */
    constructor(options: JsFunctionOptions = {}) {
        super(options);

        this.name = options.name || null;
        this.signature = options.signature || [];
        this.variables = options.variables || [];
    }

    /**
     * Define a local variable.
     * 
     * @param  {string} varName
     * @return {void}
     */
    public define(varName: string): void {
        this.variables.push(varName);
    }

    /**
     * Cast a function to a string.
     * 
     * @return {string}
     */
    public toString(): string {
        // if our function has no content, and no name, return noop
        if (!this.name && this.isEmpty()) {
            return 'noop';
        }

        const signature = this.signature.join(', ');
        
        const content = indent(this.content.join('\n').trim());

        const variables = this.variables.length > 0
            ? `${indent(`let ${this.variables.join(', ')};`)}\n\n`
            : '';

        return `function ${this.name || ''}(${signature}) {\n${variables}${content}\n}`;
    }
}