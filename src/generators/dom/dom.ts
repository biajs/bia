import Fragment from './fragment/fragment';
import { JsCode, JsFunction, JsIf } from '../code/index';
import { CompileOptions, ParsedSource } from '../../interfaces';

// @todo: read this value from package.json
const version = '0.0.0';

export default function(source: ParsedSource, options: CompileOptions) {
    const code = new JsCode({ id: 'root' });

    // create our main fragment
    const fragment = new Fragment({
        name: 'create_main_fragment',
        node: source.template,
    });

    code.append(fragment);
    code.append(null);

    // build the dom fragment and return the source code
    fragment.build();

    // prepend noop, in the future this should be a helper
    code.prepend(null);
    code.prepend(`function noop() {}`);

    // prepend any helpers we might have used
    code.getHelpers().forEach(helper => {
        code.prepend(null);
        code.prepend(helper);
    });

    // stick the compiler version at the top of the file
    code.prepend(`// bia v${version}`);

    // create our main constructor function
    code.append(getComponentConstructor(source, options));
    code.append(null);

    // add our export line
    code.append(getComponentExport(source, options));

    return String(code);
}

/**
 * Component constructor function.
 * 
 * @param  {ParsedSource}   source 
 * @param  {CompileOptions} options
 * @return {JsFunction}
 */
function getComponentConstructor(source: ParsedSource, options: CompileOptions): JsFunction {
    const constructor = new JsFunction({
        name: options.name,
        signature: ['options'],
    });

    constructor.append(`this.$fragment = create_main_fragment(this);`);
    constructor.append(null);
    constructor.append(new JsIf({
        condition: 'options.el',
        content: [
            `this.$fragment.c();`,
            `this.$fragment.m(options.el);`,
        ],
    }));

    return constructor;
}

function getComponentExport(source: ParsedSource, options: CompileOptions): JsCode {
    const code = new JsCode;

    // function
    if (options.format === 'fn') {
        code.append(`return ${options.name};`);
    }

    // es
    else if (options.format === 'es') {
        code.append(`export default ${options.name};`);
    }

    return code;
}