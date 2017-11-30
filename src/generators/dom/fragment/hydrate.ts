import Fragment from './fragment';
import { JsCode, JsFunction } from '../../classes/index';
import { escapeJsString } from '../../../utils/string';

class FragmentHydrate {
    public fragment: Fragment;

    /**
     * Constructor
     * 
     * @param {Fragment} fragment
     */
    constructor(fragment) {
        this.fragment = fragment;
    }

    public setElementAttributes() {
        return this.fragment.getElementNodes()
            .filter(node => Object.keys(node.attributes).length)
            .reduce((attrs, node) => {
                const varName = this.fragment.getName(node);
                
                Object.keys(node.dataAttributes).forEach(key => {
                    const value = node.dataAttributes[key];
                    attrs.push(`${varName}.dataset.${key} = '${escapeJsString(value)}';`);
                });

                return attrs;
            }, []);
    }

    /**
     * Convert to a fragment hydrate function.
     * 
     * @return {JsCode}
     */
    public toCode(): JsCode {
        const content = [];
        const globalFunctions = [];

        content.push(...this.setElementAttributes());

        return content.filter(c => c).length
            ? new JsFunction({ name: 'hydrate', globalFunctions, content })
            : new JsCode({ content: ['noop'] });
    }
}

export default FragmentHydrate;