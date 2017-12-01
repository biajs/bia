//
// Options
//
export interface JsCodeOptions {
    content?: Array<JsCode>;
    id?: string;
}

//
// JsCode
//
export class JsCode {
    public content: Array<JsCode|string>;
    public id: string|null;
    public parent: JsCode|null;
    public root: JsCode|null;

    /**
     * Constructor.
     * 
     * @param  {JsCodeOptions} options
     */
    constructor(options: JsCodeOptions = {}) {
        this.content = options.content || [];
        this.id = options.id || null;
        this.parent = null;
        this.root = null;

        this.setContentParent();
    }

    /**
     * Append a piece of code to the script.
     * 
     * @param  {JsCode} code 
     * @return {void}
     */
    public append(code: JsCode): void {
        code.parent = this;
        code.root = this.root;
        this.content.push(code);
    }

    /**
     * Find a piece of code that is a direct child of the content.
     * 
     * @param  {JsCode|string}      target
     * @return {JsCode|undefined} 
     */
    public findCode(target: JsCode|string) {
        return this.content.find(code => {
            return (typeof target === 'string' && typeof code !== 'string' && code.id === target)
                || code === target;
        });
    }

    /**
     * Find a piece of descendent code.
     * 
     * @param  {JsCode|string}      target
     * @return {JsCode|undefined} 
     */
    public findDescendentCode(target: JsCode|string) {
        return this.getDescendents().find(code => {
            return (typeof target === 'string' && typeof code !== 'string' && code.id === target)
                || code === target;
        });
    }

    /**
     * Helper function to find a piece of related code.
     * 
     * @param  {JsCode|string}      target
     * @return {JsCode|undefined} 
     */
    public findRelatedCode(target: JsCode|string) {
        return (this.getRoot() || this).findDescendentCode(target);
    }

    /**
     * Get an array of all descendent code.
     * 
     * @return {Array<JsCode>}
     */
    public getDescendents() {
        const descendents = [];

        function walkDescendents(code) {
            code.content
                .filter(child => typeof child !== 'string')
                .forEach(child => {
                    descendents.push(child);
                    walkDescendents(child);
                });
        }

        walkDescendents(this);

        return descendents;
    }

    /**
     * Get the root code instance.
     * 
     * @return {JsCode|null}
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
     * @param  {JsCode} insertCode
     * @param  {string} targetId
     * @return {void} 
     */
    public insertAfter(insertCode: JsCode, target: JsCode|string): void {
        const targetCode = this.findRelatedCode(target);
        
        if (targetCode) {
            insertCode.parent = targetCode.parent;
            
            targetCode.parent.content.splice(targetCode.parent.content.indexOf(targetCode) + 1, 0, insertCode);
        }
    }

    /**
     * Insert code before another piece of code.
     * 
     * @param  {JsCode} insertCode
     * @param  {string} targetId
     * @return {void} 
     */
    public insertBefore(insertCode: JsCode, target: JsCode|string): void {
        const targetCode = this.findRelatedCode(target);

        if (targetCode) {
            insertCode.parent = targetCode.parent;
            
            targetCode.parent.content.splice(targetCode.parent.content.indexOf(targetCode), 0, insertCode);
        }
    }

    /**
     * Prepend a piece of code to the script.
     * 
     * @param  {JsCode} code 
     * @return {void}
     */
    public prepend(code: JsCode): void {
        code.parent = this;
        code.root = this.root;
        this.content.unshift(code);
    }

    /**
     * Register each piece of descendent code with the script.
     * 
     * @return {void}
     */
    public setContentParent(): void {
        this.content.forEach(child => {
            if (typeof child !== 'string') {
                child.parent = this;
            }
        });
    }
}