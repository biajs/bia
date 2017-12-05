import { JsFunctionOptions } from '../../code/JsFunction';
import { JsFunction, JsObject, JsReturn } from '../../code/index';
import CreateFunction from './lifecycle/create';
import { ParsedNode } from '../../../interfaces';

//
// Options
//
export interface FragmentOptions extends JsFunctionOptions {
    node: ParsedNode;
}

//
// Fragment
//
export default class extends JsFunction {
    public node: ParsedNode;

    /**
     * Constructor.
     * 
     * @param  {FragmentOptions} options 
     */
    constructor(options: FragmentOptions) {
        super(options);

        // set our fragment's node and signature
        this.node = options.node;
        this.signature = ['vm'];
    }

    /**
     * Build up our dom fragment.
     * 
     * @return void
     */
    public build() {
        // create our lifecycle methods
        const create = new CreateFunction({});

        // add a return statement containing our lifecycle methods
        this.append(new JsReturn({
            value: new JsObject({
                properties: {
                    c: create,
                }
            }),
        }));

        // build our lifecycle methods
        create.build();
    }
}