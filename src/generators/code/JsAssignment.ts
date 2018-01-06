import { BaseCode, BaseCodeOptions } from './BaseCode';
import { isCodeInstance } from '../../utils/code';

//
// options
//
export interface JsAssignmentOptions extends BaseCodeOptions {
    left: string,
    right: number|string|BaseCode,
};

/**
 * Javascript assignment.
 */
export class JsAssignment extends BaseCode {
    public left: string;
    public right: number|string|BaseCode;

    /**
     * Constructor.
     */
    constructor(options: JsAssignmentOptions) {
        super(options);

        this.left = options.left;
        this.right = options.right;
    }
    
    /**
     * Get class name.
     * 
     * @return {string}
     */
    public getClassName(): string {
        return 'JsAssignment';
    }

    /**
     * Get descendent code.
     * 
     * @return  {Array}
     */
    public getDescendents() {
        return this.right instanceof BaseCode
            ? [this.right]
            : [];
    }

    /**
     * Cast to a string.
     * 
     * @return  {string}
     */
    public toString(): string {
        const isFunction = this.right instanceof BaseCode && this.right.getClassName() === 'JsFunction';

        return `${ this.left } = ${ this.right }${ isFunction ? '' : ';' }`;
    }
}