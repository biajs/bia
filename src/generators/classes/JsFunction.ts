import { Code, CodeOptions } from './Code';
import { indent } from '../../utils/string';

interface JsFunctionOptions extends CodeOptions {
    name?: string,
    signature?: Array<string>,
}

/**
 * Javascript function.
 */
export class JsFunction extends Code {
    public name: string;
    public signature: Array<string>;

    /**
     * Constructor.
     */
    constructor(options: JsFunctionOptions) {
        super(options);
        this.name = options.name || '';
        this.signature = options.signature || [];
    }

    /**
     * Convert function to a string.
     * 
     * @return {string}
     */
    public toString(): string {
        const signature = this.signature.join(', ');
        const content = indent(this.content.join('\n'));

        return `function ${this.name}(${signature}) {\n${content}\n}`;
    }
}