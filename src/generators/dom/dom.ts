import { JsCode, JsFunction, JsIf } from '../code/index';
import { CompileOptions, JsFragmentNode, ParsedNode, ParsedSource } from '../../interfaces';
import { JsFragment } from './fragment/JsFragment';
// import { noop as noopHelper } from '../../generators/dom/helpers/index';

import {
    processElement,
} from './processors';

/**
 * Compile a component into code to be run in the browser.
 * 
 * @return {string}
 */
export default function(source: ParsedSource, options: CompileOptions) {
    const code = new JsCode;
    const fragments: Array<JsFragmentNode> = [];

    // add the component constructor
    code.prepend(constructorFn(source, options));

    // process the template nodes
    code.prepend(null);
    processNode(code, source.template, fragments, 'create_main_fragment');

    // prepend necessary helpers
    code.helpers.forEach(helper => {
        code.prepend(null);
        code.prepend(helper);
    });

    // @todo: find a better way to register the no-op helper
    code.prepend(null);
    code.prepend(`function noop() {}`);

    // prepend our version number
    code.prepend(null);
    code.prepend('// bia v0.0.0');

    // finally, append our export
    appendExportStatement(code, options);
    
    return code.toString();
}

/**
 * Build up a component's constructor function.
 * 
 * @param  {ParsedSource}   source 
 * @param  {CompileOptions} options 
 * @return {JsFunction}
 */
function constructorFn(source: ParsedSource, options: CompileOptions) {
    const constructor = new JsFunction({
        name: options.name,
        signature: ['options'],
    });

    // create our component's main fragment
    constructor.append('const fragment = create_main_fragment(this);');
    constructor.append(null);

    // mount to an element if one was provided
    constructor.append(new JsIf({
        condition: 'options.el',
        content: [
            `this.$el = fragment.c();`,
            `fragment.m(options.el, options.anchor || null);`,
        ],
    }));

    return constructor;
}

/**
 * Append code to export the component.
 * 
 * @param  {ParsedSource}   source 
 * @param  {CompileOptions} options 
 * @return {JsFunction}
 */
function appendExportStatement(code: JsCode, options: CompileOptions) {
    code.append(null);

    // function
    if (options.format === 'fn') {
        code.append(`return ${options.name};`);
    }

    // es
    else if (options.format === 'es') {
        code.append(`export default ${options.name};`);
    }
}

/**
 * Get the fragment for a particular node, or create one.
 * 
 * @param  {JsCode}                 code 
 * @param  {ParsedNode}             node 
 * @param  {Array<JsFragmentNode>}  fragments
 * @param  {String}                 name
 * @return {JsFragment}
 */
function getFragment(code: JsCode, node: ParsedNode, fragments: Array<JsFragmentNode>, name: string) {
    const existingFragment = fragments.find(obj => obj.node === node);

    if (existingFragment) {
        return existingFragment.fragment;
    }

    const fragment = new JsFragment;

    fragment.name = code.getVariableName(fragment, name)
    
    return fragment;
}

/**
 * Recursively processes parsed nodes into fragments.
 * 
 * @param  {JsCode}     code 
 * @param  {ParsedNode} node 
 * @param  {String}     name
 * @return {void}
 */
function processNode(code: JsCode, node: ParsedNode, fragments: Array<JsFragmentNode>, name: string) {
    const fragment = getFragment(code, node, fragments, name);

    processElement(code, node, fragment);

    code.prepend(fragment);
}