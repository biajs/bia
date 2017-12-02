//
// Options
//
export interface BaseCodeOptions {
    content?: Array<BaseCode>;
    id?: string;
}

//
// BaseCode
//
export abstract class BaseCode {
    public content: Array<BaseCode|string>;
    public id: string|null;
    public parent: BaseCode|null;

    /**
     * Constructor.
     * 
     * @param  {BaseCodeOptions} options
     */
    constructor(options: BaseCodeOptions = {}) {
        this.content = options.content || [];
        this.id = options.id || null;
        this.parent = null;
    }

    /**
     * Find a piece of code that is a direct child of the content.
     * 
     * @param  {BaseCode|string}      target
     * @return {BaseCode|undefined} 
     */
    public findCode(target: BaseCode|string) {
        return this.content.find(code => {
            return (typeof target === 'string' && typeof code !== 'string' && code.id === target)
                || code === target;
        });
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
     * Get all descendents of the current code.
     * 
     * @return {Array<DescendentCode>}
     */
    abstract getDescendents();

    /**
     * Get the root code instance.
     * 
     * @return {BaseCode|null}
     */
    public getRoot() {
        let parent = this.parent;

        while(parent && parent.parent) {
            parent = parent.parent;
        }

        return parent || this;
    }

    /**
     * Insert code after another piece of code.
     * 
     * @param  {BaseCode} insertCode
     * @param  {string} target
     * @return {void} 
     */
    public insertAfter(insertCode: BaseCode, target: BaseCode|string): void {
        const targetCode = this.findRelatedCode(target);
        
        if (targetCode) {
            insertCode.parent = targetCode.parent;
            
            targetCode.parent.content.splice(targetCode.parent.content.indexOf(targetCode) + 1, 0, insertCode);
        } else {
            throw `Failed to insert code, target code not found.`;
        }
    }

    /**
     * Insert code before another piece of code.
     * 
     * @param  {BaseCode} insertCode
     * @param  {string} target
     * @return {void} 
     */
    public insertBefore(insertCode: BaseCode, target: BaseCode|string): void {
        const targetCode = this.findRelatedCode(target);

        if (targetCode) {
            insertCode.parent = targetCode.parent;
            
            targetCode.parent.content.splice(targetCode.parent.content.indexOf(targetCode), 0, insertCode);
        } else {
            throw `Failed to insert code, target code not found.`;
        }
    }

    /**
     * Helper function to insert the current code instance after related code.
     * 
     * @param  {BaseCode} target
     * @return {void} 
     */
    public insertSelfAfter(target: BaseCode): void {
        target.getRoot().insertAfter(this, target);
    }
  
    /**
     * Helper function to insert the current code instance before related code.
     * 
     * @param  {BaseCode} target
     * @return {void} 
     */
    public insertSelfBefore(target: BaseCode): void {
        target.getRoot().insertBefore(this, target);
    }
}