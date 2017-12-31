import { JsCode, JsFunction, JsIf } from '../../code/index';
import { JsFunctionOptions } from '../../code/JsFunction';
import { ParsedNode } from '../../../interfaces';
import { getDirective } from '../../../utils/parsed_node';
import { namespaceIdentifiers } from '../../../utils/code';

export interface JsConditionalOption extends JsFunctionOptions {
    rootCode: JsCode,
}

export class JsConditional extends JsFunction {
    protected branches: Array<ParsedNode>;
    protected rootCode: JsCode;

    /**
     * Javascript function to select a conditional fragment.
     */
    constructor(options: JsConditionalOption) {
        super(options);
        this.branches = [];
        this.rootCode = options.rootCode;
        this.signature = ['vm'];

        // give our conditional branches a name
        this.name = this.rootCode.getVariableName(this, 'select_block_type');
    }

    /**
     * Append an if branch.
     * 
     * @param  {ParsedNode} node
     * @param  {string}     fragmentName 
     * @return {void}
     */
    public addIf(node: ParsedNode, fragmentName: string): void {
        this.branches.push(node);
        
        const { expression } = getDirective(node, 'if') || getDirective(node, 'else-if');

        this.append(`if (${namespaceIdentifiers(expression)}) return ${fragmentName};`);
    }

    /**
     * Append the final else branch.
     * 
     * @param  {ParsedNode} node
     * @param  {string}     fragmentName 
     * @return {void}
     */
    public addElse(node: ParsedNode, fragmentName: string): void {
        this.branches.push(node);
        
        this.append(`return ${fragmentName};`);
    }    
    
    /**
    * Get class name.
    * 
    * @return {string}
    */
   public getClassName(): string {
       return 'JsConditional';
   }

   public hasBranch(node: ParsedNode) {
       return this.branches.indexOf(node) > -1;
   }
}