export interface BaseCodeOptions {
    id?: null | string;
}

export interface DescendentCode {
    code: BaseCode;
    parent: BaseCode;
}

/**
 * Base code class.
 */
export abstract class BaseCode {
    public id: string;
    public options: BaseCodeOptions;

    /**
     * Constructor.
     */
    constructor(options: BaseCodeOptions) {
        this.id = options.id || null;
        this.options = options;
    }

    /**
     * Get all descendents of the current code.
     * 
     * @return {Array<DescendentCode>}
     */
    abstract getDescendents(): Array<DescendentCode>;
    
    /**
     * Get the ids of all descendent code instances.
     * 
     * @return {Array<string>}
     */
    public getDescendentIds(): Array<string> {
        return this.getDescendents()
            .map(descendent => descendent.code.id)
            .filter(id => id !== null);
    }
    
    /**
     * Validate that this code instance's id is unique.
     */
    public validateId() {
        if (this.id && this.getDescendentIds().includes(this.id)) {
            throw `Invalid code structure, duplicate id "${this.id}" defined.`;
        }
    }
}