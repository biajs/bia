import Fragment from '../fragment';
import { JsCode, JsFunction } from '../../../code/index';
import { ParsedNode } from '../../../../interfaces';
import { createElement, createText, setHtml, setText } from '../../helpers/index';
import { escapeJsString } from '../../../../utils/string';
import { getDirective, isElementNode, isTextNode, nodeHasDirective, removeProcessedDirective } from '../../../../utils/parsed_node';

export default class CreateFunction extends JsFunction {
    public fragment: Fragment;

    /**
     * Constructor.
     * 
     * @param  {Object} options 
     */
    constructor(fragment: Fragment) {
        super({});

        this.name = 'create';
        this.fragment = fragment;
    }

    /**
     * Build the create function.
     * 
     * @return {void}
     */
    public build(): void {
        this.defineDomNodes(this.fragment.node);
        this.returnRootElement();
    }

    /**
     * Define if, else if, and else branches.
     * 
     * @param  {ParsedNode} node
     * @return {void} 
     */
    public defineConditionalBranches(node: ParsedNode): void {
        const branch = new JsCode;
        const directive = getDirective(node, 'if');
        const varName = this.fragment.getVariableName(node, 'if_block');
        const fragmentName = `create_${varName}`;
        const processedNode = removeProcessedDirective(node, directive);

        const childFragment = new Fragment({
            name: fragmentName,
            node: processedNode,
        });

        childFragment.build();
        childFragment.insertSelfBefore(this.fragment);

        branch.append(`var ${varName} = (${directive.expression}) && ${fragmentName}(vm);`);
        branch.append(null);

        const rootVarName = this.fragment.getVariableName(this.fragment.node);
        this.append(`if (${varName}) ${varName}.c();`);

        this.insertBefore(branch, this.findAncestor('JsReturn'));
    }
    
    /**
     * Define any child text or dom nodes.
     * 
     * @return {void}
     */
    public defineDomNodes(node: ParsedNode) {
        // define dom elements
        if (isElementNode(node)) {
            this.defineElementNode(node);
        }

        // define text nodes
        else if (isTextNode(node)) {
            this.defineTextNode(node);
        }
    }

    /**
     * Define a dom element.
     * 
     * @param  {ParsedNode} node
     * @return {void}
     */
    public defineElementNode(node: ParsedNode): void {
        const tagName = node.tagName.toLowerCase();
        const varName = this.fragment.getVariableName(node, tagName);

        this.fragment.define(varName);
        this.useHelper(createElement);
        this.append(`${varName} = createElement('${tagName}');`);

        // if the node has dynamic children, define them
        if (node.hasDynamicChildren) {
            node.children.forEach(child => {
                if (nodeHasDirective(child, 'if')) {
                    this.defineConditionalBranches(child);
                    // @todo: handle else-if and else branches
                } else {
                    this.defineDomNodes(child);
                }
            });
        }

        // otherwise set purely static content
        else {
            this.setStaticContent(node);
        }
    }

    /**
     * Define a text node.
     * 
     * @param  {ParsedNode} node
     * @return {void}
     */
    public defineTextNode(node: ParsedNode): void {
        const varName = this.fragment.getVariableName(node, 'text');

        this.fragment.define(varName);

        this.useHelper(createText);
        
        this.append(`${varName} = createText('${escapeJsString(node.textContent)}');`);
    }

    /**
     * Return the root element.
     * 
     * @return {void}
     */
    public returnRootElement(): void {
        const varName = this.fragment.getVariableName(this.fragment.node);

        this.append(null);
        this.append(`return ${varName};`);
    }

    /**
     * Set purely static content.
     * 
     * @return {void}
     */
    public setStaticContent(node: ParsedNode): void {
        const tagName = node.tagName.toLowerCase();
        const varName = this.fragment.getVariableName(node, tagName);
        
        // if the node only has text content, set that directly
        if (node.children.length === 1 && isTextNode(node.children[0])) {
            this.useHelper(setText);
            this.append(`setText(${varName}, '${escapeJsString(node.children[0].textContent)}');`);
        }

        // otherwise set the node's inner html
        else {
            this.useHelper(setHtml);
            this.append(`setHtml(${varName}, '${escapeJsString(node.innerHTML)}');`);
        }
    }
}