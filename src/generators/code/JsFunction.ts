import { JsCode, JsCodeOptions } from './JsCode';
import { indent } from '../../utils/string';

//
// Options
//
export interface JsFunctionOptions extends JsCodeOptions {
    name?: string|null;
    signature?: Array<string>;
}

//
// JsFunction
//
export class JsFunction extends JsCode {
    public name: string|null;
    public signature: Array<string>;

    /**
     * Constructor.
     */
    constructor(options: JsFunctionOptions = {}) {
        super(options);

        this.name = options.name || null;
        this.signature = options.signature || [];
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

        return `function ${this.name || ''}(${signature}) {\n${content}\n}`;
    }
}