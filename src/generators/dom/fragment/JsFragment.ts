import { CompileOptions, ParsedNode, ParsedSource } from '../../../interfaces';
import { JsCode, JsFunction, JsReturn, JsObject } from '../../code/index';
import { JsFunctionOptions } from '../../code/JsFunction';

export interface JsFragmentOptions extends JsFunctionOptions {
    rootNode: ParsedNode;
}

export class JsFragment extends JsFunction {
    public code: JsCode;
    public create: JsFunction;
    public destroy: JsFunction;
    public mount: JsFunction;
    public returnObj: JsReturn;
    public rootNode: ParsedNode;
    public unmount: JsFunction;
    public update: JsFunction;

    /**
     * Javascript function to manage a dom fragment.
     */
    constructor(options: JsFragmentOptions) {
        super(options);

        this.rootNode = options.rootNode;

        this.signature = ['vm'];

        this.code = new JsCode;

        this.create = new JsFunction({ name: 'create' });
        
        this.destroy = new JsFunction({ name: 'destroy' });

        this.mount = new JsFunction({ 
            name: 'mount',
            signature: ['target', 'anchor'],
        });

        this.unmount = new JsFunction({ name: 'unmount' });

        this.update = new JsFunction({ name: 'update' });

        this.returnObj = new JsReturn({
            value: new JsObject({
                properties: {
                    c: this.create,
                    d: this.destroy,
                    m: this.mount,
                    u: this.unmount,
                    p: this.update,
                },
            }),
        });

        this.append(this.code);
        
        this.append(this.returnObj);
    }
}