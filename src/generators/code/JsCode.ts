import { BaseCode, BaseCodeOptions } from './BaseCode';

export interface JsCodeOptions extends BaseCodeOptions {
    content?: Array<BaseCode|string>;
}

export class JsCode extends BaseCode {
    public content: Array<BaseCode|string>;
    
    /**
     * Constructor.
     */
    constructor(options: JsCodeOptions = {}) {
        super(options);
        this.content = options.content || [];
        this.setContentParent();
        this.validateIds();
    }

    /**
     * Append a piece of code to the script.
     * 
     * @param  {BaseCode} code 
     * @return {void}
     */
    public append(code: BaseCode): void {
        code.parent = this;
        this.content.push(code);
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
     * Get an array of all descendent code.
     * 
     * @return {Array<BaseCode>}
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
            
            if (targetCode.parent instanceof JsCode) {
                targetCode.parent.content.splice(targetCode.parent.content.indexOf(targetCode) + 1, 0, insertCode);
            } else {
                throw `Failed to insert code after, the target's parent is not a JsCode instance.`;
            }
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
            
            if (targetCode.parent instanceof JsCode) {
                targetCode.parent.content.splice(targetCode.parent.content.indexOf(targetCode), 0, insertCode);
            } else {
                throw `Failed to insert code after, the target's parent is not a JsCode instance.`;
            }
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
        const root = target.getRoot();

        if (root instanceof JsCode) {
            root.insertAfter(this, target);
        } else {
            throw `Failed to insert code, root node is not a JsCode instance.`;
        }
    }
  
    /**
     * Helper function to insert the current code instance before related code.
     * 
     * @param  {BaseCode} target
     * @return {void} 
     */
    public insertSelfBefore(target: BaseCode): void {
        const root = target.getRoot();
        
        if (root instanceof JsCode) {
            root.insertBefore(this, target);
        } else {
            throw `Failed to insert code, root node is not a JsCode instance.`;
        }
    }

    /**
     * Prepend a piece of code to the script.
     * 
     * @param  {BaseCode} code 
     * @return {void}
     */
    public prepend(code: BaseCode): void {
        code.parent = this;
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

    /**
     * Convert object to javascript source code.
     * 
     * @return {string}
     */
    public toString(): string {
        return this.content.join('\n');
    }
}