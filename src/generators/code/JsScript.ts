import { JsCode } from './JsCode';

//
// Options
//
export interface JsScriptOptions {
    content?: Array<JsCode>;
}

//
// JsScript
//
export class JsScript {
    public content: Array<JsCode>;

    /**
     * Constructor.
     * 
     * @param  {JsScriptOptions} options
     */
    constructor(options: JsScriptOptions = {}) {
        this.content = options.content || [];

        this.setContentScript();
    }

    /**
     * Append a piece of code to the script.
     * 
     * @param  {JsCode} code 
     * @return {void}
     */
    public append(code: JsCode): void {
        code.script = this;
        this.content.push(code);
    }

    /**
     * Find a piece of code that is a direct child of the content.
     * 
     * @param  {JsCode|string}      target
     * @return {JsCode|undefined} 
     */
    public findCode(target: JsCode|string): JsCode|undefined {
        return this.content.find(code => {
            return typeof target === 'string'
                ? code.id === target
                : code === target;
        })
    }

    /**
     * Insert code after another piece of code.
     * 
     * @param  {JsCode} insertCode
     * @param  {string} targetId
     * @return {void} 
     */
    public insertAfter(insertCode: JsCode, targetId: string): void {
        // if the target is a direct child of the script, splice it in
        const targetCode = this.findCode(targetId);
        
        if (targetCode) {
            this.content.splice(this.content.indexOf(targetCode) + 1, 0, insertCode);
            insertCode.script = this;
        }
    }

    /**
     * Insert code before another piece of code.
     * 
     * @param  {JsCode} insertCode
     * @param  {string} targetId
     * @return {void} 
     */
    public insertBefore(insertCode: JsCode, targetId: string): void {
        // if the target is a direct child of the script, splice it in
        const targetCode = this.findCode(targetId);

        if (targetCode) {
            this.content.splice(this.content.indexOf(targetCode), 0, insertCode);
            insertCode.script = this;
        }
    }

    /**
     * Prepend a piece of code to the script.
     * 
     * @param  {JsCode} code 
     * @return {void}
     */
    public prepend(code: JsCode): void {
        code.script = this;
        this.content.unshift(code);
    }

    /**
     * Register each piece of descendent code with the script.
     * 
     * @return {void}
     */
    public setContentScript(): void {
        this.content.forEach(code => code.script = this);
    }
}