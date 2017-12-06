import Fragment from '../fragment';
import { JsFunction } from '../../../code/index';
import { ParsedNode } from '../../../../interfaces';
import { appendNode, insertNode } from '../../helpers/index';
import { nodeHasDirective } from '../../../../utils/parsed_node';

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
        this.signature = ['target', 'anchor'];
        this.fragment = fragment;
    }

    /**
     * Recursively append child nodes.
     * 
     * @param  {ParsedNode} node
     * @return {void}
     */
    public appendChildNode(node: ParsedNode): void {
        // mount if blocks
        if (nodeHasDirective(node, 'if')) {
            const varName = this.fragment.getVariableName(node);
            const parentVarName = this.fragment.getVariableName(node.parent);

            this.append(`if (${varName}) ${varName}.m(${parentVarName}, null);`)
        }

        // mount static nodes
        else {
            const varName = this.fragment.getVariableName(node);
            const parentVarName = this.fragment.getVariableName(node.parent);

            this.useHelper(appendNode);
            
            this.append(`appendNode(${varName}, ${parentVarName});`);
        }
    }

    /**
     * Build the mount function.
     * 
     * @return {void}
     */
    public build(): void {
        this.insertRootElement();

        if (this.fragment.node.hasDynamicChildren) {
            this.fragment.node.children.forEach(child => {
                this.appendChildNode(child);
            });
        }
    }

    /**
     * Insert the root element into the dom.
     * 
     * @return {void}
     */
    public insertRootElement(): void {
        this.useHelper(insertNode);
        const varName = this.fragment.getVariableName(this.fragment.node);

        this.append(`insertNode(${varName}, target, anchor);`);
    }
}