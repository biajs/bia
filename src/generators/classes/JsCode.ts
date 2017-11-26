import { BaseCode, BaseCodeOptions, DescendentCode } from './BaseCode';
import { getDuplicateMembers } from '../../utils/array';

export interface JsCodeOptions extends BaseCodeOptions {
    content?: Array<any>;
    root?: boolean;
}

/**
 * Raw code objects.
 */
export class JsCode extends BaseCode {
    public content: Array<JsCode|string>;
    public root: boolean;

    /**
     * Constructor.
     */
    constructor(options: JsCodeOptions) {
        super(options);

        this.content = options.content || [];
        this.root = options.root || false;

        this.validateId();
    }

    /**
     * Create an array of all descendent code instances.
     * 
     * @return {Array<DescendentCode>}
     */
    public getDescendents(): Array<DescendentCode> {
        return this.content.reduce((descendents, code) => {
            if (code && typeof code !== 'string') {
                descendents.push({ parent: this, code });
                descendents = descendents.concat(code.getDescendents());
            }

            return descendents;
        }, []);
    }

    /**
     * Find any global functions defined by descendent code.
     * 
     * @return Array<JsFunction>
     */
    public getDescendentGlobalFunctions(): Array<any> {
        // create a unique array of every global fn declared by a descendent
        const globalFns = this.getDescendents()
            .map(descendent => descendent.code.globalFunctions)
            .reduce((globalFns, descendentGlobalFns) => globalFns.concat(descendentGlobalFns), [])
            .reduce((uniqueFns, fn) => {
                if (!uniqueFns.find(uniqueFn => uniqueFn !== null && uniqueFn.id === fn.name)) {
                    uniqueFns.push(fn);
                    uniqueFns.push(null); // <- add newline after each global fn
                }

                return uniqueFns;
            }, []);

        // make sure no global fns are using the same name, and throw an error if there is
        const duplicateFns = getDuplicateMembers(globalFns.filter(fn => fn).map(fn => fn.name));

        if (duplicateFns.length > 0) {
            throw `Multiple global functions were declared using the name '${duplicateFns[0]}'.`;
        }

        return globalFns;
    }
        
    /**
     * Convert code object to a string.
     * 
     * @return {string}
     */
    public toString(): string {
        // if root, hoist global functions declared by descendents
        const content = this.root
            ? this.getDescendentGlobalFunctions()
            : [];

        return content.concat(this.content).join('\n').trim();
    }
}