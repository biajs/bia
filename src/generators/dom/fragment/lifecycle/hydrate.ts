import Fragment from '../fragment';
import { JsFunction } from '../../../code/index';
import { ParsedNode } from '../../../../interfaces';

export default class HydrateFunction extends JsFunction {
    public fragment: Fragment;

    /**
     * Constructor.
     * 
     * @param  {Object} options 
     */
    constructor(fragment: Fragment) {
        super({});

        this.name = 'hydrate';
        this.fragment = fragment;
    }

    /**
     * Build the hydrate function.
     * 
     * @return {void}
     */
    public build(): void {

    }
}