import { BaseCode, BaseCodeOptions, DescendentCode } from './BaseCode';
import { JsCode, JsObject } from './index';

export interface JsReturnOptions extends BaseCodeOptions {
    value: JsCode | JsObject,
}

/**
 * Javascript return statement.
 */
export class JsReturn extends BaseCode {
    public value: JsCode | JsObject;

    /**
     * Constructor.
     */
    constructor(options: JsReturnOptions) {
        super(options);

        this.value = options.value;

        this.validateId();
    }

    /**
     * Get descendent code.
     * 
     * @return {Array<DescendentCode>}
     */
    public getDescendents(): Array<DescendentCode> {
        return this.value.getDescendents().concat({ 
            code: this.value, 
            parent: this,
        });
    }

    /**
     * Cast to a string.
     * 
     * @return {string}
     */
    public toString(): string {
        const returnCode = String(this.value).trim();

        return returnCode.endsWith(';')
            ? `return ${returnCode}`
            : `return ${returnCode};`;
    }
}