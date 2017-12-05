import Fragment from '../fragment';
import { JsFunction } from '../../../code/index';
import { ParsedNode } from '../../../../interfaces';

export default class DestroyFunction extends JsFunction {
    public fragment: Fragment;

    /**
     * Constructor.
     * 
     * @param  {Object} options 
     */
    constructor(fragment: Fragment) {
        super({});

        this.name = 'destroy';
        this.fragment = fragment;
    }

    /**
     * Build the destroy function.
     * 
     * @return {void}
     */
    public build(): void {

    }
}