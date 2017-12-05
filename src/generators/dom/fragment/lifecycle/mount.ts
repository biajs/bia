import Fragment from '../fragment';
import { JsFunction } from '../../../code/index';
import { ParsedNode } from '../../../../interfaces';
import { createElement } from '../../helpers/index';

export default class MountFunction extends JsFunction {
    public fragment: Fragment;

    /**
     * Constructor.
     * 
     * @param  {Object} options 
     */
    constructor(fragment: Fragment) {
        super({});

        this.name = 'mount';
        this.fragment = fragment;
    }

    /**
     * Build the mount function.
     * 
     * @return {void}
     */
    public build(): void {

    }
}