import processors from './processors/index';
import { CompileOptions, DomProcessor, JsFragmentNode, ParsedNode, ParsedSource } from '../../interfaces';
import { JsCode, JsFunction, JsIf } from '../code/index';
import { JsFragment } from './functions/JsFragment';
import { indent } from '../../utils/string';

//
// helpers
//
import {
    assign,
    defineReactive,
    emit,
    executePendingUpdates,
    init,
    nextTick,
    observe,
    on,
    proxy,
    setChangedState,
} from './helpers/index';

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

    // @todo: find a better way to register the no-op helper
    code.prepend(null);
    code.prepend(`function noop() {}`);

    // prepend necessary helpers
    code.useHelper(assign);
    code.useHelper(defineReactive);
    code.useHelper(emit);
    code.useHelper(executePendingUpdates);
    code.useHelper(init);
    code.useHelper(nextTick);
    code.useHelper(observe);
    code.useHelper(on);
    code.useHelper(proxy);
    code.useHelper(setChangedState);

    code.helpers.forEach(helper => {
        code.prepend(null);
        code.prepend(helper);
    });

    // prepend our component's changedState and isUpdating variables
    code.prepend(null);
    code.prepend(`var changedState = {}, isUpdating = false, queue = [];`);

    // prepend the compiler version for easier debugging
    code.prepend(null);
    code.prepend('// bia v0.0.0');

    // assign our vm methods
    assignComponentMethods(code, options);

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

    // initialize the component
    constructor.append(`init(this, options);`);
    constructor.append(`this.$state = assign({}, options.data);`);
    constructor.append(null);

    // proxy our state onto the vm instance
    constructor.append(`proxy(this, this.$state);`);
    constructor.append(null);

    // create our component's main fragment
    constructor.append('const fragment = create_main_fragment(this);');
    constructor.append(null);

    // observe our state, and when anything changes update the fragment
    constructor.append(`observe(this.$state, [], fragment.p);`);
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
 * @return {void}
 */
function appendExportStatement(code: JsCode, options: CompileOptions): void {
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
 * Assign component methods.
 * 
 * @param  {ParsedSource}   source 
 * @param  {CompileOptions} options 
 * @return {void}
 */
function assignComponentMethods(code: JsCode, options: CompileOptions): void {
    // @todo: clean this up, maybe with a JsFunctionCall class?
    code.append(null);
    code.append(`assign(${options.name}.prototype, {`);
    code.append(indent('$emit: emit,'));
    code.append(indent('$nextTick: nextTick,'));
    code.append(indent('$on: on,'));
    code.append(`});`);
}

/**
 * Create a new fragment.
 * 
 * @param  {JsCode}                 code 
 * @param  {ParsedNode}             rootNode 
 * @param  {Array<JsFragmentNode>}  fragments
 * @param  {String}                 name
 * @param  {Array<string>}          scope
 * @return {JsFragment}
 */
export function createFragment(
    code: JsCode, 
    rootNode: ParsedNode, 
    fragments: Array<JsFragmentNode>, 
    name: string,
    scope: Array<string> = [],
) {
    const fragment = new JsFragment({ rootNode, scope });

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
    // @ts-ignore
    processors.forEach((processor: DomProcessor) => {
        if (typeof processor.process === 'function') {
            processor.process(code, node, fragment);
        }
    });

    // give any of the processors a chance to define a child fragment
    let childFragment;

    // @ts-ignore
    processors.forEach((processor: DomProcessor) => {
        if (typeof processor.createChildFragments === 'function') {
            childFragment = processor.createChildFragments(code, node, fragments, fragment) || childFragment;
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
    // @ts-ignore
    processors.forEach((processor: DomProcessor) => {
        if (typeof processor.postProcess === 'function') {
            processor.postProcess(code, node, fragment);
        }
    });
}