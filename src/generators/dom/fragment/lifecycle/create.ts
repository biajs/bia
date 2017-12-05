import { JsFunction } from '../../../code/index';

export default class Create extends JsFunction {

    /**
     * Constructor.
     * 
     * @param  {Object} options 
     */
    constructor(options) {
        super(options);

        this.name = 'create';
    }

    /**
     * Build the create function.
     * 
     * @return {void}
     */
    public build(): void {
        this.defineStaticElements();
    }

    /**
     * Walk the dom node and define any purely static elements.
     * 
     * @return {void}
     */
    public defineStaticElements() {

    }
}