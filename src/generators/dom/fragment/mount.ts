import Fragment from './fragment';
import { JsFunction } from '../../classes/index';

class MountFn {
    public fragment: Fragment;

    /**
     * Constructor
     * 
     * @param {Fragment} fragment
     */
    constructor(fragment) {
        this.fragment = fragment;
    }

    /**
     * Convert to a fragment hydrate function.
     * 
     * @return {JsFunction}
     */
    public toCode(): JsFunction {
        const content = [];

        // mount our root node
        content.push(`replaceNode(${this.fragment.getName(this.fragment.node)});`);

        return new JsFunction({
            name: 'mount',
            signature: ['target'],
            content,
        });
    }
}

export default MountFn;