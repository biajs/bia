import { JsFunction } from '../../classes/JsFunction';
import Fragment from './fragment';
import { createElement } from '../global_functions';
import { nodeRequiresHydration } from '../../../utils/parsed_node';

class FragmentCreate {
    public fragment: Fragment;

    /**
     * Constructor.
     * 
     * @param  {Fragment} fragment 
     */
    constructor(fragment) {
        this.fragment = fragment
    }

    public defineDomNodes() {
        const nodes = [];
        
        this.fragment.getElementNodes().forEach(node => {
            if (node.type === 'ELEMENT') {
                nodes.push(`${this.fragment.getName(node)} = createElement("${node.tagName.toLowerCase()}");`);
            }
        });

        return nodes;
    }

    /**
     * Convert to a fragment create function.
     * 
     * @return {JsFunction}
     */
    public toCode(): JsFunction {
        const content = [];
        const globalFunctions = [];

        // define any dom nodes that we need to
        const definedDomNodes = this.defineDomNodes();

        if (definedDomNodes) {
            globalFunctions.push(createElement());
            content.push(...definedDomNodes);
        }

        // hydrate our node if neccessary
        if (nodeRequiresHydration(this.fragment.node)) {
            content.push(null, `this.h();`);
        }

        // define our vm's $el property
        content.push(null, `vm.$el = ${this.fragment.getName(this.fragment.node)};`);

        return new JsFunction({
            name: 'create',
            globalFunctions,
            content,
        });
    }
}

export default FragmentCreate;