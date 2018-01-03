import { BaseCode, BaseCodeOptions } from './BaseCode';
import { JsFunction } from '../code/index';
import { isCodeInstance } from '../../utils/code';
import { indent } from '../../utils/string';

//
// options
//
export interface JsClassMethods { 
    [name: string]: {
        signature?: Array<string>;
        content?: Array<any>;
    }
}

export interface JsClassOptions extends BaseCodeOptions {
    content?: Array<BaseCode|string|null>,
    methods?: JsClassMethods;
    name: string;
    signature?: Array<string>;
};

/**
 * Javascript class.
 */
export class JsClass extends BaseCode {
    public content: Array<BaseCode|string|null>;
    public methods: JsClassMethods;
    public name: string;
    public signature: Array<string>;

    /**
     * Constructor.
     */
    constructor(options: JsClassOptions) {
        super(options);

        this.content = options.content || [];
        this.methods = options.methods || {};
        this.name = options.name;
        this.signature = options.signature || [];
    }
    
    /**
     * Get class name.
     * 
     * @return {string}
     */
    public getClassName(): string {
        return 'JsClass';
    }

    /**
     * Get descendent code.
     * 
     * @return  {Array}
     */
    public getDescendents() {
        const descendents: Array<BaseCode> = [];

        // find descendents from the constructor
        this.content.forEach(line => {
            if (line instanceof BaseCode) {
                descendents.push(line);
            }
        });

        // find descendents from our class methods
        Object.keys(this.methods).forEach(name => {
            this.methods[name].content.forEach(line => {
                if (line instanceof BaseCode) {
                    descendents.push(line);
                }
            });
        });
        
        return descendents;
    }

    /**
     * Cast to a string.
     * 
     * @return  {string}
     */
    public toString(): string {
        let output = `class ${this.name ? this.name + ' ' : ''}{`;

        // attach constructor
        if (this.content.length > 0) {
            const content = this.content.join('\n');
            const signature = this.signature.join(', ');
            output += `\n${indent(`constructor(${signature}) {\n${indent(content)}\n}`)}`;
        }

        // attach methods
        Object.keys(this.methods).forEach((name: string) => {
            let method = ``;
            const content = this.methods[name].content.join('\n');
            const signature = (this.methods[name].signature || []).join(', ');
            method += `${name}(${signature}) {\n${indent(content)}\n}`;
            output += `\n${indent(method)}`;
        });

        output += `\n}`;

        return output;
    }
}