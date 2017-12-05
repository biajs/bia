import { getDuplicateMembers, getUniqueMembers } from '../../utils/array';
import { JsFunction, JsHelper } from './index';

//
// Options
//
export interface BaseCodeOptions {
    helpers?: Array<JsHelper>;
    id?: string;
}

//
// BaseCode
//
export abstract class BaseCode {
    public helpers: Array<JsHelper>;
    public id: string|null;
    public options: BaseCodeOptions;
    public parent: BaseCode|null;

    /**
     * Constructor.
     * 
     * @param  {BaseCodeOptions} options
     */
    constructor(options: BaseCodeOptions = {}) {
        this.helpers = options.helpers || [];
        this.id = options.id || null;
        this.options = options;
        this.parent = null;
    }
    
    /**
     * Get class name.
     * 
     * @return {string}
     */
    abstract getClassName(): string;

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
     * Get an ancestor piece of code.
     * 
     * @param  {string} target 
     * @param  {number} distance 
     */
    public findAncestor(target: string, distance: number = 0): BaseCode {
        let parent = this.parent;
        let ancestorCount = 0;

        while (parent) {
            if (parent.getClassName() === target) {
                if (ancestorCount >= distance) {
                    return parent;
                }

                ancestorCount += 1;
            }

            parent = parent.parent;
        }

        throw `Failed to find ancestor.`;
    }

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
     * Get all descendent dependency functions.
     * 
     * @return {Array<JsHelper>}
     */
    public getHelpers(): Array<JsHelper> {
        const helpers = this.helpers;

        this.getDescendents().forEach(descendent => {
            helpers.push(...descendent.helpers);
        });
        
        return getUniqueMembers(helpers);
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
     * Find the current JsFunction scope.
     * 
     * @return {JsFunction|void}
     */
    public getParentFunction(): BaseCode {
        return this.findAncestor('JsFunction');
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
     * Use a helper if it isn't already.
     * 
     * @param  {JsHelper} helper
     * @return {void}
     */
    public useHelper(helper: JsHelper): void {
        if (!this.helpers.includes(helper)) {
            this.helpers.push(helper);
        }
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