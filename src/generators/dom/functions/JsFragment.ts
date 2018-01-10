import { CompileOptions, ParsedNode, ParsedSource } from '../../../interfaces';
import { JsCode, JsFunction, JsReturn, JsObject } from '../../code/index';
import { JsFunctionOptions } from '../../code/JsFunction';

export interface JsFragmentOptions extends JsFunctionOptions {
    rootNode: ParsedNode;
    scope?: Array<string>;
}

export class JsFragment extends JsFunction {
    public code: JsCode;
    public create: JsFunction;
    public destroy: JsFunction;
    public hydrate: JsFunction;
    public mount: JsFunction;
    public returnObj: JsReturn;
    public rootNode: ParsedNode;
    public scope: Array<string>;
    public unmount: JsFunction;
    public update: JsFunction;

    /**
     * Javascript function to manage a dom fragment.
     */
    constructor(options: JsFragmentOptions) {
        super(options);

        this.rootNode = options.rootNode;

        this.scope = options.scope || [];

        this.signature = ['vm'];

        this.code = new JsCode;

        this.create = new JsFunction({ name: 'create' });
        
        this.destroy = new JsFunction({ name: 'destroy' });

        this.hydrate = new JsFunction({ name: 'hydrate' });

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
                    h: this.hydrate,
                    m: this.mount,
                    p: this.update,
                    u: this.unmount,
                },
            }),
        });

        this.append(this.code);
        
        this.append(this.returnObj);
    }

    /**
     * Cast fragment to a string.
     * 
     * @return {string}
     */
    public toString(): string {
        // keep track of our signature without scoped vars
        const unscopedSignature = this.signature.slice(0);

        // append our scoped vars to the signature and cast to a string
        this.signature = this.signature.concat(this.scope);
        const source = super.toString();

        // reset the signature array to exclude scoped vars, and return the source
        this.signature = unscopedSignature;

        return source;
    }
}