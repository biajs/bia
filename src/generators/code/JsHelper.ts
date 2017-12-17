import { JsFunction, JsFunctionOptions } from './JsFunction';

//
// Options
//
export interface JsHelperOptions extends JsFunctionOptions {
    id: string;
    name: string;
}

//
// JsHelper
//
export class JsHelper extends JsFunction {

    /**
     * Constructor.
     * 
     * @param  {JsHelperOptions} options
     */
    constructor(options: JsHelperOptions) {
        super(options);
    }
    
    /**
     * Get class name.
     * 
     * @return {string}
     */
    public getClassName(): string {
        return 'JsHelper';
    }
}