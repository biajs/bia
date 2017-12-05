import Fragment from '../fragment';
import { JsFunction } from '../../../code/index';
import { ParsedNode } from '../../../../interfaces';
import { createElement } from '../../helpers/index';

export default class Create extends JsFunction {
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
        this.setStaticContent();
        // define if blocks
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
        this.helpers.push(createElement);
        this.content.push(`${varName} = createElement('${tagName}');`);
    }

    /**
     * Walk the dom node and define any purely static elements.
     * 
     * @return {void}
     */
    public defineStaticElements() {
        
    }

    /**
     * Set purely static content.
     * 
     * @return {void}
     */
    public setStaticContent(): void {

    }
}