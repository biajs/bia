import Fragment from '../fragment';
import { JsCode, JsFunction } from '../../../code/index';
import { NodeDirective, ParsedNode } from '../../../../interfaces';
import { createElement, createText, setHtml, setText } from '../../helpers/index';
import { escapeJsString } from '../../../../utils/string';
import { getDirective, getNextElementNode, isElementNode, isTextNode, nodeHasDirective, removeProcessedDirective } from '../../../../utils/parsed_node';
const snakeCase = require('snake-case');

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
     * Define if block fragments
     * 
     * @param  {ParsedNode}     node
     * @param  {NodeDirective}  directive
     * @return {void}
     */
    public createIfBlock(node: ParsedNode, directive: NodeDirective) {
        // do nothing if we've already processed this directive
        if (directive.isProcessed) {
            return;
        }

        // otherwise process it
        directive.isProcessed = true;

        // create a child fragment constructor, and insert it before out
        // this fragment. we'll call this when it's condition is true.
        const varName = this.fragment.parent.getVariableName(node, snakeCase(directive.name));

        const childFragment = new Fragment({
            node,
            name: `create_${varName}_block`,
            parent: this.fragment.parent,
        });

        this.fragment.parent.insertBefore(childFragment, this.fragment);

        childFragment.build();

        // // insert code to instantiate our branch into the fragment
        // const branch = new JsCode({
        //     content: [`var ${varName} = (${directive.expression}) && create_${varName}(vm);`, null],
        // });

        // branch.insertSelfBefore(this.findAncestor('JsReturn'));

        // // and finally, if the condition is true, call the child fragment's create method
        // const rootVarName = this.fragment.getVariableName(this.fragment.node);
        
        // this.append(`if (${varName}) ${varName}.c();`);

        return `create_${varName}_block`;
    }

    /**
     * Define if, else if, and else branches.
     * 
     * @param  {ParsedNode} node
     * @return {void} 
     */
    public defineConditionalBranches(node: ParsedNode): void {
        // check if the next node also has conditional directives
        const nextNode = getNextElementNode(node);

        if (nodeHasDirective(nextNode, 'else-if') || nodeHasDirective(nextNode, 'else')) {
            this.defineFullIfBranch(node);
        }

        // otherwise, define a stand-alone if block
        // else this.createIfBlock(node);
    }

    /**
     * Define an if/else-if/else block.
     * 
     * @param node 
     */
    public defineFullIfBranch(node: ParsedNode): void {
        const name = this.fragment.parent.getVariableName(node, 'select_block_type');

        // define our select block within this fragment
        const fragmentDefinition = new JsCode({
            content: ['// ohsdfsdfsdfshit']
        });

        this.fragment.insertBefore(fragmentDefinition, this.findAncestor('JsReturn'));

        const selectBlock = new JsFunction({
            name,
        });

        // append our initial condition
        const directive = getDirective(node, 'if');
        const ifBlock = this.createIfBlock(node, directive);
        selectBlock.append(`if (${directive.expression}) return ${ifBlock};`);

        // walk down the tree and define any else-if / else branches
        let next = getNextElementNode(node);

        while (nodeHasDirective(next, 'else-if') || nodeHasDirective(next, 'else')) {

            // once we hit an else block, break out of this loop
            if (nodeHasDirective(next, 'else')) {
                let elseDirective = getDirective(next, 'else');
                let elseBlock = this.createIfBlock(next, elseDirective);

                selectBlock.append(`return ${elseBlock};`);

                break;
            }

            next = getNextElementNode(next);
        }
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