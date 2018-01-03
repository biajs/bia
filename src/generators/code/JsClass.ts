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
    name: string;
    methods?: JsClassMethods;
};

/**
 * Javascript class.
 */
export class JsClass extends BaseCode {
    public name: string;
    public methods: JsClassMethods;

    /**
     * Constructor.
     */
    constructor(options: JsClassOptions) {
        super(options);

        this.name = options.name;
        this.methods = options.methods || {};
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
        return [];
    }

    /**
     * Cast to a string.
     * 
     * @return  {string}
     */
    public toString(): string {
        let output = `class ${this.name ? this.name + ' ' : ''}{`;

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