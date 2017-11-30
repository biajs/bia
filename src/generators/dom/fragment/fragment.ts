import { ParsedNode } from '../../../interfaces';
import { nodeHasDirective } from '../../../utils/parsed_node';
import { JsVariable } from '../../classes/index';

interface FragmentOptions {
    parent?: Fragment,
}

class Fragment {
    public node: ParsedNode;
    public parent: Fragment | null;

    /**
     * Constructor.
     */
    constructor(node: ParsedNode, options: FragmentOptions = {}) {
        this.node = node;
        this.parent = options.parent || null;
    }

    /**
     * Define a javascript variable for each node this fragment manages.
     * 
     * @return {JsVariable}
     */
    public getVariables() {

    }

    /**
     * Determine which descendent nodes belong to this fragment.
     */
    public getElementNodes() {
        const getChildNodes = (childNodes, node: ParsedNode) => {
            if (!nodeHasDirective(node, 'if')) {
                childNodes.push(node);
            }

            return childNodes
        }

        return this.node.children.reduce(getChildNodes, [this.node]);
    }
}

export default Fragment;