import { BaseCode, BaseCodeOptions, DescendentCode } from './BaseCode';

export interface JsCodeOptions extends BaseCodeOptions {
    content?: Array<any>
}

/**
 * Raw code objects.
 */
export class JsCode extends BaseCode {
    public content: Array<JsCode|string>;

    /**
     * Constructor.
     */
    constructor(options: JsCodeOptions) {
        super(options);
        this.content = options.content || [];
        this.validateId();
    }

    /**
     * Create an array of all descendent code instances.
     * 
     * @return {Array<DescendentCode>}
     */
    public getDescendents(): Array<DescendentCode> {
        return this.content.reduce((descendents, code) => {
            if (code && typeof code !== 'string') {
                descendents.push({ parent: this, code });
                descendents = descendents.concat(code.getDescendents());
            }

            return descendents;
        }, []);
    }
        
    /**
     * Convert code object to a string.
     * 
     * @return {string}
     */
    public toString(): string {
        return this.content.join('\n');
    }
}