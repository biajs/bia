import { JsIf, JsFunction } from '../../code/index';
import { CompileOptions, ParsedSource } from '../../../interfaces';

/**
 * Generate a component's constructor function.
 * 
 * @return {JsFunction}
 */
export default function(options: CompileOptions) {
    const constructor = new JsFunction({
        name: options.name,
        signature: ['options'],
    });

    // create our component's main fragment
    constructor.append('this.$fragment = create_main_fragment(this);');
    constructor.append(null);

    // mount to an element if one was provided
    constructor.append(new JsIf({
        condition: 'options.el',
        content: [
            `this.$el = this.$fragment.c();`,
            `this.$fragment.$m(options.el, options.anchor || null);`,
        ],
    }));

    return constructor;
}