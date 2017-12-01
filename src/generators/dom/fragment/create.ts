import { JsCode, JsFunction } from '../../classes/index';
import Fragment from './fragment';
import { createElement } from '../global_functions';
import { nodeRequiresHydration } from '../../../utils/parsed_node';
import { ParsedNode } from '../../../interfaces';
import { escapeJsString} from '../../../utils/string';

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

    /**
     * Define variables for the fragment's nodes.
     * 
     * @param  {Array<ParsedNode>} nodes
     * @return {JsCode}
     */
    public defineDomNodes(nodes: Array<ParsedNode>): JsCode {
        const content = [];
        const globalFunctions = [];
        let usedCreateElement = false;
        
        nodes.forEach(node => {
            if (node.type === 'ELEMENT') {
                usedCreateElement = true;
                content.push(`${this.fragment.getName(node)} = createElement('${node.tagName.toLowerCase()}');`);
            }
        });

        // include the createElement function if we used it
        if (usedCreateElement) {
            globalFunctions.push(createElement());
        }

        return new JsCode({
            content,
            globalFunctions,
        });
    }

    /**
     * Create an if block if it's condition is true.
     * 
     * @param nodes 
     */
    public defineIfBlocks(): JsCode {
        const content = [];

        this.fragment.getIfNodes().forEach(node => {
            const varName = this.fragment.getChildFragmentName(node);
            const parentName = this.fragment.getName(node.parent);

            content.push(`if (${varName}) ${varName}.c();`);
        });

        return new JsCode({
            content,
        });
    }

    public defineTextValues(nodes: Array<ParsedNode>): JsCode {
        const content = [];

        // @todo...

        return new JsCode({
            content,
        });
    }

    /**
     * Set purely static content.
     * 
     * @param  {Array<ParsedNode} nodes
     * @return {JsCode}
     */
    public setStaticContent(nodes: Array<ParsedNode>): JsCode {
        const content = [];

        nodes.forEach(node => {
            if (!node.hasDynamicChildren) {
                const varName = this.fragment.getName(node);

                if (node.type === 'ELEMENT') {
                    if (node.children.length === 1 && node.children[0].type === 'TEXT') {
                        const textNode = node.children[0];
                            
                        content.push(`${varName}.textContent = '${escapeJsString(textNode.textContent)}';`);
                    } else {
                        content.push(`${varName}.innerHTML = '${escapeJsString(node.innerHTML)}';`);
                    }
                }
            }
        });

        return new JsCode({
            content,
        });
    }

    /**
     * Convert to a fragment create function.
     * 
     * @return {JsFunction}
     */
    public toCode(): JsFunction {
        const content = [];
        const globalFunctions = [];
        const nodes = this.fragment.getChildNodes();

        // define neccessary fragment variables
        content.push(this.defineDomNodes(nodes));
        content.push(this.defineTextValues(nodes));
        content.push(this.defineIfBlocks());

        // set static content
        content.push(this.setStaticContent(nodes));

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