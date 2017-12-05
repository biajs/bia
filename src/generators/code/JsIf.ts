import { BaseCode, BaseCodeOptions } from './BaseCode';
import { indent } from '../../utils/string';
import { isCodeInstance } from '../../utils/code';

//
// Options
//
export interface ElseIf {
    condition: string;
    content: Array<BaseCode|string|null>;
}

export interface JsIfOptions extends BaseCodeOptions {
    condition: string;
    content?: Array<BaseCode|string|null>;
    elseIf?: Array<ElseIf>;
    else?: Array<BaseCode|string|null>;
}

export class JsIf extends BaseCode {
    public condition: string;
    public content: Array<BaseCode|string|null>;
    public elseIf: Array<ElseIf>;
    public else: Array<BaseCode|string|null>;

    /**
     * Constructor.
     * 
     * @param  {JsIfOptions} options 
     */
    constructor(options: JsIfOptions) {
        super(options);

        this.condition = options.condition;
        this.content = options.content || [];
        this.elseIf = options.elseIf || [];
        this.else = options.else || [];

        this.validateIds();
        this.setDescendentParents();
    }
    
    /**
     * Get class name.
     * 
     * @return {string}
     */
    public getClassName(): string {
        return 'JsIf';
    }

    /**
     * Get descendent code.
     * 
     * @return {Array<BaseCode>}
     */
    public getDescendents(): Array<BaseCode> {
        const descendents: Array<BaseCode> = [];
        
        const addDescendents = (content) => {
            content.filter(isCodeInstance).forEach(child => {
                descendents.push(child, ...child.getDescendents());
            });
        }
        
        addDescendents(this.content);
        
        this.elseIf.forEach(elseIf => addDescendents(elseIf.content));
        
        addDescendents(this.else);

        return descendents;
    }

    /**
     * Convert to a string.
     * 
     * @return {string}
     */
    public toString(): string {
        let code = `if (${this.condition}) {\n${indent(this.content.join('\n'))}\n}`;

        // append any elseIf branches we might have
        this.elseIf.forEach(elseIf => {
            code += ` else if (${elseIf.condition}) {\n${indent(elseIf.content.join('\n'))}\n}`;
        });

        // append our else branch if we have one
        if (this.else.length > 0) {
            code += ` else {\n${indent(this.else.join('\n'))}\n}`;
        }

        return code;
    }

    /**
     * Take ownership of each piece of descendent code.
     * 
     * @return {void}
     */
    public setDescendentParents(): void {
        const setParent = (child: BaseCode) => child.parent = this;

        this.content
            .filter(isCodeInstance)
            .forEach(setParent);

        this.elseIf.forEach((elseIf) => {
            elseIf.content
                .filter(isCodeInstance)
                .forEach(setParent);
        });

        this.else
            .filter(isCodeInstance)
            .forEach(setParent);
    }
}