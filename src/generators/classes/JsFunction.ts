import { JsCode, JsCodeOptions } from './JsCode';
import { collapseNewlines } from '../../utils/string';
import { indent } from '../../utils/string';

interface JsFunctionOptions extends JsCodeOptions {
    name?: string,
    signature?: Array<string>,
}

/**
 * Javascript function.
 */
export class JsFunction extends JsCode {
    public name: string;
    public signature: Array<string>;

    /**
     * Constructor.
     * 
     * @param  {JsFunctionOptions} options
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
        if (this.content.length) {
            const signature = this.signature.join(', ');
            const content = indent(this.content.join('\n').trim());

            return `function ${this.name}(${signature}) {\n${content}\n}`;
        }
        
        return `function ${this.name}() {}`;
    }
}