import { BaseCode, BaseCodeOptions } from './BaseCode';

export interface JsVariableWithValue {
    name: string,
    value: number|string,
}

export interface JsVariableOptions extends BaseCodeOptions {
    define: JsVariableWithValue | string | Array<JsVariableWithValue | string>;
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

        this.define = Array.isArray(options.define)
            ? options.define
            : [options.define];
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