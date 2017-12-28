import processors from './processors/index';
import { CompileOptions, DomProcessor, JsFragmentNode, ParsedNode, ParsedSource } from '../../interfaces';
import { JsCode, JsFunction, JsIf } from '../code/index';
import { JsFragment } from './fragment/JsFragment';
// import { noop as noopHelper } from '../../generators/dom/helpers/index';

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

    // create our root fragment, which will recursively create child fragments
    const mainFragment = createFragment(code, source.template, fragments, 'create_main_fragment');


    processNode(code, source.template, fragments, mainFragment);

    code.prepend(null);
    code.prepend(mainFragment);
    

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
 * Create a new fragment.
 * 
 * @param  {JsCode}                 code 
 * @param  {ParsedNode}             rootNode 
 * @param  {Array<JsFragmentNode>}  fragments
 * @param  {String}                 name
 * @return {JsFragment}
 */
export function createFragment(code: JsCode, rootNode: ParsedNode, fragments: Array<JsFragmentNode>, name) {
    const fragment = new JsFragment({ rootNode });

    fragment.name = code.getVariableName(fragment, name);

    fragments.push({ fragment, node: rootNode });

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
export function processNode(code: JsCode, node: ParsedNode, fragments: Array<JsFragmentNode>, fragment: JsFragment) {
    // pass the currenty node to each element processor
    processors.forEach((processor: DomProcessor) => {
        if (typeof processor.process === 'function') {
            processor.process(code, node, fragment);
        }
    });

    // give any of the processors a chance to define a child fragment
    let childFragment;

    processors.forEach((processor: DomProcessor) => {
        if (typeof processor.createChildFragments === 'function') {
            childFragment = processor.createChildFragments(code, node, fragments) || childFragment;
        }
    });

    // if we have a child fragment, prepend that to the output and process it
    if (childFragment) {
        code.prepend(null);
        code.prepend(childFragment);
        fragments.push({ node, fragment: childFragment });
        processNode(code, node, fragments, childFragment);
    } else {
        // otherwise recursively process the nodes below the current one
        node.children.forEach(child => processNode(code, child, fragments, fragment));
    }

    // call any post-processors that exist
    processors.forEach((processor: DomProcessor) => {
        if (typeof processor.postProcess === 'function') {
            processor.postProcess(code, node, fragment);
        }
    });
}