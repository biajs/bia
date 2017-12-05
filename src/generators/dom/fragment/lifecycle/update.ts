import Fragment from '../fragment';
import { JsFunction } from '../../../code/index';
import { ParsedNode } from '../../../../interfaces';

export default class UpdateFunction extends JsFunction {
    public fragment: Fragment;

    /**
     * Constructor.
     * 
     * @param  {Object} options 
     */
    constructor(fragment: Fragment) {
        super({});

        this.name = 'update';
        this.fragment = fragment;
    }

    /**
     * Build the update function.
     * 
     * @return {void}
     */
    public build(): void {

    }
}