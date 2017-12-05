import Fragment from '../fragment';
import { JsFunction } from '../../../code/index';
import { ParsedNode } from '../../../../interfaces';

export default class UnmountFunction extends JsFunction {
    public fragment: Fragment;

    /**
     * Constructor.
     * 
     * @param  {Object} options 
     */
    constructor(fragment: Fragment) {
        super({});

        this.name = 'unmount';
        this.fragment = fragment;
    }

    /**
     * Build the unmount function.
     * 
     * @return {void}
     */
    public build(): void {

    }
}