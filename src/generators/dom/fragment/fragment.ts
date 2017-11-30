import { ParsedNode } from '../../../interfaces';
import { nodeHasDirective } from '../../../utils/parsed_node';
import { JsVariable } from '../../classes/index';

interface FragmentOptions {
    parent?: Fragment,
}

interface NamedNode {
    name: string,
    node: ParsedNode,
}

class Fragment {
    public nameCounter: Object;
    public namedNodes: Array<NamedNode>;
    public node: ParsedNode;
    public parent: Fragment | null;

    /**
     * Constructor.
     */
    constructor(node: ParsedNode, options: FragmentOptions = {}) {
        this.nameCounter = {};
        this.namedNodes = [];
        this.node = node;
        this.parent = options.parent || null;
    }

    /**
     * Define a javascript variable for each node this fragment manages.
     * 
     * @return {JsVariable}
     */
    public getElementVariables() {
        return new JsVariable({
            define: this.getElementNodes().map(node => this.getName(node)),
        });
    }

    /**
     * Get the variable name of a node.
     * 
     * @param  {ParsedNode} node
     * @return {string}
     */
    public getName(node: ParsedNode): string {
        // check if we've already named this node
        const alreadyNamed = this.namedNodes.find(namedNode => namedNode.node === node);

        if (alreadyNamed) {
            return alreadyNamed.name;
        }

        // and if not, assign it a unique name
        let varName = 'unknown';

        if (node.type === 'ELEMENT') {
            varName = node.tagName.toLowerCase();
        } else {
            varName = node.type.toLowerCase();
        }

        // if we've never named this node type before, use the varName
        if (typeof this.nameCounter[varName] === 'undefined') {
            this.nameCounter[varName] = 0;
            this.namedNodes.push({ name: varName, node });

            return varName;
        }

        // otherwise add an identifier to the varName and use that
        const numberedVarName = `${varName}_${++this.nameCounter[varName]}`;
        this.namedNodes.push({ name: numberedVarName, node });
        
        return numberedVarName;
    }

    /**
     * Determine which descendent nodes belong to this fragment.
     */
    public getElementNodes() {
        const getChildNodes = (childNodes, node: ParsedNode) => {
            if (!nodeHasDirective(node, 'if')) {
                childNodes.push(node);

                if (node.hasDynamicChildren) {
                    node.children.forEach(child => {
                        childNodes.push(...getChildNodes([], child));
                    });
                }
            }

            return childNodes;
        }

        return getChildNodes([], this.node);
    }
}

export default Fragment;