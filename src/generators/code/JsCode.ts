import { BaseCode, BaseCodeOptions } from './BaseCode';
import { isCodeInstance } from '../../utils/code';

export interface JsCodeOptions extends BaseCodeOptions {
    content?: Array<BaseCode|string|null>;
}

export interface JsCodeVariable {
    name: string;
    obj: Object;
}

export class JsCode extends BaseCode {
    public content: Array<BaseCode|string|null>;
    public variableNames: Array<JsCodeVariable>;
    public variablePrefixCounter: Object;
    
    /**
     * Constructor.
     */
    constructor(options: JsCodeOptions = {}) {
        super(options);

        this.content = options.content || [];
        this.variableNames = [];
        this.variablePrefixCounter = {};

        this.setContentParent();
        this.validateIds();
    }

    /**
     * Append a piece of code to the script.
     * 
     * @param  {BaseCode|string} code 
     * @return {void}
     */
    public append(code: BaseCode|string): void {
        if (code instanceof BaseCode) {
            code.parent = this;
        }
        
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

        this.content
            .filter(isCodeInstance)
            .forEach((child: BaseCode) => descendents.push(child, ...child.getDescendents()));

        return descendents;
    }

    /**
     * Get the name of a variable.
     * 
     * @param  {Object} obj
     * @param  {string} prefix
     * @return {string} 
     */
    public getVariableName(obj: Object, prefix: string = 'unknown'): string {
        // return the name if we've already named this object
        const namedObj = this.variableNames.find(namedObj => namedObj.obj === obj);

        if (namedObj) {
            return namedObj.name;
        }

        // otherwise name the variable, and keep track of our prefix counts
        let name = prefix;

        if(typeof this.variablePrefixCounter[prefix] === 'undefined') {
            this.variablePrefixCounter[prefix] = 1;
        } else {
            name = `${prefix}_${this.variablePrefixCounter[prefix]++}`;
        }

        this.variableNames.push({ name, obj });

        return name;
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
     * Determine if the code block is empty.
     * 
     * @return {boolean}
     */
    public isEmpty(): boolean {
        return this.content.filter(line => line !== null).length === 0;
    }

    /**
     * Prepend a piece of code to the script.
     * 
     * @param  {BaseCode|string} code 
     * @return {void}
     */
    public prepend(code: BaseCode|string): void {
        if (code instanceof BaseCode) {
            code.parent = this;
        }

        this.content.unshift(code);
    }
    
    /**
     * Register each piece of descendent code with the script.
     * 
     * @return {void}
     */
    public setContentParent(): void {
        this.content
            .filter(child => typeof child !== 'string')
            .forEach((child: BaseCode) => child.parent = this);
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