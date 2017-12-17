import { BaseCode, BaseCodeOptions } from './BaseCode';
import { JsFunction, JsObject } from './index';
import { isCodeInstance } from '../../utils/code';

//
// Options
//
export interface JsReturnOptions extends BaseCodeOptions {
    value: JsFunction|JsObject|string;
}

//
// JsReturn
//
export class JsReturn extends BaseCode {
    value: JsFunction|JsObject|string;

    /**
     * Constructor.
     * 
     * @param  {JsReturnOptions} options
     */
    constructor(options: JsReturnOptions) {
        super(options);

        this.value = options.value;
        this.setValueParent();
        this.validateIds();
    }
    
    /**
     * Get class name.
     * 
     * @return {string}
     */
    public getClassName(): string {
        return 'JsReturn';
    }

    /**
     * Get descendent code.
     * 
     * @return {Array<BaseCode|string>}
     */
    public getDescendents(): Array<BaseCode> {
        const descendents = [];

        if (isCodeInstance(this.value)) {
            // @ts-ignore: we are only pushing BaseCode objects onto this array
            descendents.push(this.value, ...this.value.getDescendents());
        }
        
        return descendents;
    }

    /**
     * Set the return value's parent property.
     * 
     * @return {void}
     */
    public setValueParent(): void {
        if (isCodeInstance(this.value)) {
            // @ts-ignore: we know this.value is a code instance
            this.value.parent = this;
        }
    }

    /**
     * Convert to a string.
     * 
     * @return {string}
     */
    public toString(): string {
        return `return ${String(this.value)};`;
    }
}
