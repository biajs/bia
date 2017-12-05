import CreateFunction from './lifecycle/create';
import DestroyFunction from './lifecycle/destroy';
import HydrateFunction from './lifecycle/hydrate';
import MountFunction from './lifecycle/mount';
import UnmountFunction from './lifecycle/unmount';
import UpdateFunction from './lifecycle/update';
import { JsFunction, JsObject, JsReturn } from '../../code/index';
import { JsFunctionOptions } from '../../code/JsFunction';
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
        const create = new CreateFunction(this);
        const destroy = new DestroyFunction(this);
        const hydrate = new HydrateFunction(this);
        const mount = new MountFunction(this);
        const unmount = new UnmountFunction(this);
        const update = new UpdateFunction(this);

        // add a return statement containing our lifecycle methods
        this.append(new JsReturn({
            value: new JsObject({
                properties: {
                    c: create,
                    d: destroy,
                    h: hydrate,
                    m: mount,
                    p: update,
                    u: unmount,
                }
            }),
        }));

        // build our lifecycle methods
        create.build();
        destroy.build();
        hydrate.build();
        mount.build();
        update.build();
        unmount.build();
    }
}