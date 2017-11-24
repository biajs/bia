import { Code, CodeOptions } from './Code';
import { indent } from '../../utils/string';

export interface JsIfOptions extends CodeOptions {
    condition: string;
    elseIf?: Array<JsIf>;
    else?: Array<Code|string>;
}

/**
 * Javascript if statement
 */
export class JsIf extends Code {
    public condition: string;
    public elseIf: Array<JsIf>;
    public else: Array<Code|string> | null;

    /**
     * Constructor.
     * 
     * @param  {JsIfOptions} options
     */
    constructor(options: JsIfOptions) {
        super(options);
        this.condition = options.condition;
        this.elseIf = options.elseIf || [];
        this.else = options.else || null;
    }

    /**
     * Cast an if statement to a string.
     */
    public toString(): string {

        // build up our basic if branch
        let source = `if (${this.condition}) {\n${indent(String(this.content))}\n}`;

        // append any elseIf branches
        this.elseIf.forEach(elseIf => source += ` else ${String(elseIf)}`);
    
        // tack on our else branch if there is one
        if (this.else) {
            source += ` else {\n${indent(String(this.else))}\n}`;
        }

        return source;
    }
}