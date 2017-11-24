import { BaseCode, BaseCodeOptions, DescendentCode } from './BaseCode';

interface CodeOptions extends BaseCodeOptions {
    content?: Array<any>
}

/**
 * Raw code objects.
 */
export class Code extends BaseCode {
    public content: Array<Code|string>;

    /**
     * Constructor.
     */
    constructor(options: CodeOptions) {
        super(options);
        this.content = options.content || [];
        this.validateId();
    }

    /**
     * Create an array of all descendent code instances.
     * 
     * @return {Array<Code>}
     */
    public getDescendents(): Array<DescendentCode> {
        return this.content.reduce((descendents, code) => {
            if (typeof code !== 'string') {
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