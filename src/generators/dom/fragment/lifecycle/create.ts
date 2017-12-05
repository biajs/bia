import Fragment from '../fragment';
import { JsFunction } from '../../../code/index';
import { ParsedNode } from '../../../../interfaces';
import { createElement, setHtml, setText } from '../../helpers/index';
import { escapeJsString } from '../../../../utils/string';
import { isTextNode } from '../../../../utils/parsed_node';

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
        this.defineRootElement();
        this.defineStaticElements();

        // if the node has dynamic content, create it.
        // otherwise set our purely static content.
        if (this.fragment.node.hasDynamicChildren) {
            // @todo: set dynamic content
        } else {
            this.setStaticContent();
        }

        // @todo: define if blocks

        this.setVmElement();
    }

    /**
     * Define the root dom element.
     * 
     * @return {void}
     */
    public defineRootElement(): void {
        const tagName = this.fragment.node.tagName.toLowerCase();
        const varName = this.fragment.getVariableName(this.fragment.node, tagName);

        this.fragment.define(varName);
        this.useHelper(createElement);
        this.append(`${varName} = createElement('${tagName}');`);
    }

    /**
     * Walk the dom node and define any purely static elements.
     * 
     * @return {void}
     */
    public defineStaticElements() {
        // console.log (this.fragment.node);
    }

    /**
     * Set purely static content.
     * 
     * @return {void}
     */
    public setStaticContent(): void {
        const node = this.fragment.node;
        const tagName = this.fragment.node.tagName.toLowerCase();
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

    /**
     * Define the element on our VM instance.
     * 
     * @return {void}
     */
    public setVmElement(): void {
        const tagName = this.fragment.node.tagName.toLowerCase();

        // this.append('console.log(vm)');
        
        this.append(null);
        this.append(`vm.$el = ${this.fragment.getVariableName(this.fragment.node, tagName)};`)
    }
}