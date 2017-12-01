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