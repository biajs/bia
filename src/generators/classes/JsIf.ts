import { JsCode, JsCodeOptions } from './JsCode';
import { BaseCode, BaseCodeOptions, DescendentCode } from './BaseCode';
import { indent } from '../../utils/string';

export interface JsIfOptions extends JsCodeOptions {
    condition: string;
    content?: Array<JsCode|string>
    elseIf?: Array<JsIf>;
    else?: Array<JsCode|string>;
}

/**
 * Javascript if statement
 */
export class JsIf extends BaseCode {
    public condition: string;
    public content: Array<JsCode|string>;
    public elseIf: Array<JsIf>;
    public else: Array<JsCode|string> | null;

    /**
     * Constructor.
     * 
     * @param  {JsIfOptions} options
     */
    constructor(options: JsIfOptions) {
        super(options);
        this.content = options.content || [];
        this.condition = options.condition;
        this.elseIf = options.elseIf || null;
        this.else = options.else || null;

        this.validateId();
    }

    /**
     * Create an array of all descendent code instances.
     * 
     * @return {Array<DescendentCode>}
     */
    public getDescendents(): Array<DescendentCode> {
        const ifContent = this.content;
        const elseContent = this.else || [];

        // build up an array of our else-if branch descendents
        const elseIfContent = (this.elseIf || []).reduce((descendents, code) => {
            descendents.push({ parent: this, code });
            return descendents.concat(code.getDescendents());
        }, []);

        // and concatenate them onto the descendents from our if & else branches
        return [...ifContent, ...elseContent].reduce((descendents, code) => {
            if (typeof code !== 'string') {
                descendents.push({ parent: this, code });
                descendents = descendents.concat(code.getDescendents());
            }

            return descendents;
        }, []).concat(elseIfContent);
    }

    /**
     * Cast an if statement to a string.
     */
    public toString(): string {
        // build up our basic if branch
        let source = `if (${this.condition}) {\n${indent(String(this.content))}\n}`;

        // append elseIf branches if there are any
        if (this.elseIf) {
           this.elseIf.forEach(elseIf => source += ` else ${String(elseIf)}`);
        }
        
        // tack on our else branch if there is one
        if (this.else) {
            source += ` else {\n${indent(String(this.else))}\n}`;
        }

        return source;
    }
}