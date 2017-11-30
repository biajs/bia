import Fragment from './fragment';
import { JsCode, JsFunction } from '../../classes/index';
import { ParsedNode } from '../../../interfaces';
import { nodeHasDirective } from '../../../utils/parsed_node';

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
     * Mount child elements to their parent.
     * 
     * @param  {Array<ParsedNode>} nodes
     * @return {JsCode} 
     */
    public mountChildNodes(nodes: Array<ParsedNode>): JsCode {
        const content = [];
        const globalFunctions = [];

        const appendChildNodes = (node: ParsedNode) => {
            if (node.hasDynamicChildren) {
                const varName = this.fragment.getName(node);

                node.children.forEach(child => {
                    // @todo: append if blocks
                    if (nodeHasDirective(child, 'if')) {

                    } else {
                        const childName = this.fragment.getName(child);
                        content.push(`${varName}.appendChild(${childName});`)
                    }
                });
            }
        }

        nodes.forEach(appendChildNodes);

        return new JsCode({
            content,
            globalFunctions,
        });
    }

    /**
     * Convert to a fragment hydrate function.
     * 
     * @return {JsFunction}
     */
    public toCode(): JsFunction {
        const content = [];
        const nodes = this.fragment.getElementNodes();

        // mount our root node
        content.push(`replaceNode(${this.fragment.getName(this.fragment.node)});`);

        // mount child nodes
        content.push(this.mountChildNodes(nodes));

        return new JsFunction({
            name: 'mount',
            signature: ['target'],
            content,
        });
    }
}

export default MountFn;