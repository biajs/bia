import { DomProcessor, NodeDirective, JsFragmentNode, ParsedNode } from '../../../interfaces';
import { JsCode } from '../../code/index';
import { JsFragment } from '../fragment/JsFragment';
import { createFragment } from '../dom';

//
// utils
//
import { escape } from '../../../utils/string';
import { getDirective, nodeHasDirective, removeProcessedDirective } from '../../../utils/parsed_node';

//
// helpers
//
import { 
    //
} from '../helpers/index';

/**
 * Create child fragments.
 * 
 * @param  {JsCode}                 code
 * @param  {ParsedNode}             currentNode
 * @param  {Array<JsFragmentNode>}  fragments 
 */
export function createChildFragments(code: JsCode, currentNode: ParsedNode, fragments: Array<JsFragmentNode>, fragment: JsFragment) {
    const directive = getDirective(currentNode, 'if');
    const blockName = fragment.getVariableName(currentNode, 'if_block');

    // define fragments for stand-alone if nodes
    if (directive) {
        removeProcessedDirective(currentNode, directive);

        return createFragment(code, currentNode, fragments, `create_${blockName}`);
    }

    return;
};

/**
 * Process the current node.
 * 
 * @param  {JsCode}                 code
 * @param  {ParsedNode}             currentNode
 * @param  {Array<JsFragmentNode>}  fragments 
 */
export function process(code: JsCode, currentNode: ParsedNode, fragment: JsFragment) {
    // @todo: handle conditionals on the fragment root
    // @todo: handle if blocks that have sibling else-if/else nodes
    const directive = getDirective(currentNode, 'if');

    if (directive) {
        createStandAloneIfBlock(code, currentNode, fragment, directive);
    }
};

/**
 * Process the current node after all child processors are complete.
 * 
 * @param  {JsCode}                 code
 * @param  {ParsedNode}             currentNode
 * @param  {Array<JsFragmentNode>}  fragments 
 */
export function postProcess(code: JsCode, currentNode: ParsedNode, fragment: JsFragment) {
    //
};

//
// create if blocks that have no other branches
//
function createStandAloneIfBlock(code: JsCode, currentNode: ParsedNode, fragment: JsFragment, directive: NodeDirective): void {
    const blockName = code.getVariableName(currentNode, 'if_block');
    const createBlockName = `create_${blockName}`;
    const parentEl = fragment.getVariableName(currentNode.parent);

    // define our if block if we need it
    fragment.code.append(`var ${blockName} = (${directive.expression}) && ${createBlockName}(vm);`);

    // inject the condition into our create hook
    fragment.create.append(`if (${blockName}) ${blockName}.c();`);

    // mount the if block to our parent
    fragment.mount.append(`if (${blockName}) ${blockName}.m(${parentEl}, null);`)
}