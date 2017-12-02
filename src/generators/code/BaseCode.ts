import { getDuplicateMembers } from '../../utils/array';

//
// Options
//
export interface BaseCodeOptions {
    id?: string;
}

//
// BaseCode
//
export abstract class BaseCode {
    public id: string|null;
    public parent: BaseCode|null;
    public options: BaseCodeOptions;

    /**
     * Constructor.
     * 
     * @param  {BaseCodeOptions} options
     */
    constructor(options: BaseCodeOptions = {}) {
        this.id = options.id || null;
        this.options = options;
        this.parent = null;
    }
    
    /**
     * Get all descendents of the current code.
     * 
     * @return {Array<BaseCode>}
     */
    abstract getDescendents(): Array<BaseCode>;

    /**
     * Convert object to javascript source code.
     * 
     * @return {string}
     */
    abstract toString(): string;

    /**
     * Find a piece of descendent code.
     * 
     * @param  {BaseCode|string}      target
     * @return {BaseCode|undefined} 
     */
    public findDescendentCode(target: BaseCode|string) {
        return this.getDescendents().find(code => {
            return (typeof target === 'string' && typeof code !== 'string' && code.id === target)
                || code === target;
        });
    }

    /**
     * Helper function to find a piece of related code.
     * 
     * @param  {BaseCode|string}      target
     * @return {BaseCode|undefined} 
     */
    public findRelatedCode(target: BaseCode|string) {
        return this.getRoot().findDescendentCode(target);
    }

    /**
     * Get the id of all descendent code.
     * 
     * @return {Array<string>}
     */
    public getDescendentIds(): Array<string> {
        return this.getDescendents()
            .map(descendent => descendent.id)
            .filter(id => id !== null);
    }

    /**
     * Get the root code instance.
     * 
     * @return {BaseCode|null}
     */
    public getRoot() {
        let parent = this.parent;

        while (parent && parent.parent) {
            parent = parent.parent;
        }

        return parent || this;
    }

    /**
     * Ensure that no two code objects in the tree has the same id.
     * 
     * @throws  {string}
     */
    public validateIds() {
        const ids = this.getRoot().getDescendentIds();

        if (this.id) {
            ids.push(this.id);
        }

        const duplicates = getDuplicateMembers(ids);
        
        if (duplicates.length > 0) {
            throw `Failed to construct code tree, the ID "${duplicates[0]}" occured multiple times.`;
        }
    }
}