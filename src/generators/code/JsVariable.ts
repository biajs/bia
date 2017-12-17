import { BaseCode, BaseCodeOptions } from './BaseCode';

export interface JsVariableWithValue {
    name: string,
    value: number|string|BaseCode,
}

export interface JsVariableOptions extends BaseCodeOptions {
    define?: Array<JsVariableWithValue | string>;
    name?: string,
    value?: number|string|BaseCode,
};

/**
 * Javascript variable.
 */
export class JsVariable extends BaseCode {
    public define: Array<JsVariableWithValue | string>;

    /**
     * Constructor.
     */
    constructor(options: JsVariableOptions) {
        super(options);

        this.define = [];

        // name/value syntax, used for declaring a single var
        if (typeof options.name === 'string') {
            this.define.push(typeof options.value === 'undefined'
                ? options.name
                : { name: options.name, value: options.value });
        }

        // define syntax, used for declaring multiple vars
        if (options.define) {
            this.define = this.define.concat(options.define);
        }
    }
    
    /**
     * Get class name.
     * 
     * @return {string}
     */
    public getClassName(): string {
        return 'JsVariable';
    }

    /**
     * Variable definitions have no descendent code.
     * 
     * @return  {Array}
     */
    public getDescendents() {
        return [];
    }

    /**
     * Convert variable definitions to string.
     * 
     * @return  {string}
     */
    public toString(): string {
        const definitions = this.define.map(definition => {
            return typeof definition === 'string'
                ? definition
                : `${definition.name} = ${definition.value}`;
        });

        return `var ${definitions.join(', ')};`;
    }
}