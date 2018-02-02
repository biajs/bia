import Code from './code';
import { ParsedNode } from '../interfaces';
import { deindent } from '../utils/string';

//
// options
//
interface FragmentOptions {
    name: string;
    node: ParsedNode;
    parent?: Fragment;
};

interface ObjectDefinition {
    obj: Object;
    definitions: Object; // { desired_name: 'actual_name' }
}

//
// fragment
//
export default class Fragment {
    public baseCode: Code;
    public constructorContent: Array<Code | string>;
    public createContent: Array<Code | string>;
    public definedVars: Array<ObjectDefinition>;
    public destroyContent: Array<Code | string>;
    public hydrateContent: Array<Code | string>;
    public mountContent: Array<Code | string>;
    public name: string;
    public node: ParsedNode;
    public parent: null|Fragment;
    public scopedVars: Array<string>;
    public unmountContent: Array<Code | string>;
    public updateContent: Array<Code | string>;

    //
    // constructor
    //
    constructor(baseCode: Code, options: FragmentOptions) {
        this.baseCode = baseCode;
        this.constructorContent = [];
        this.createContent = [];
        this.definedVars = [];
        this.destroyContent = [];
        this.hydrateContent = [];
        this.mountContent = [];
        this.name = options.name;
        this.node = options.node;
        this.parent = options.parent || null;
        this.scopedVars = [];
        this.unmountContent = [];
        this.updateContent = [];
    }

    // 
    // add variables to the scope
    //
    public addToScope(...args: Array<string>): void {
        args.forEach(name => this.scopedVars.push(name));
    }

    //
    // code
    //
    get code() {        
        return new Code(`
            function #${this.name}(${ this.signature.join(', ') }) {
                %definedVars
                
                %content

                return {
                    c: %create,
                    h: %hydrate,
                    m: %mount,
                    p: %update,
                    u: %unmount,
                    d: %destroy,
                };
            }
        `, {
            parent: this.baseCode,
            partials: {
                definedVars: this.definedVarsCode,
                content: this.constructorCode,
                create: this.createFunction,
                destroy: this.destroyFunction,
                hydrate: this.hydrateFunction,
                mount: this.mountFunction,
                unmount: this.unmountFunction,
                update: this.updateFunction,
            }
        });
    }

    //
    // create
    //
    get create() {
        return {
            append: content => {
                if (typeof content === 'string') {
                    content = deindent(content);
                }

                this.createContent.push(content)
            }
        }
    }

    get createFunction() {
        if (this.createContent.length === 0) return '@noop';

        return new Code(`
            function create() {
                %content
            }
        `, {
            partials: {
                content: this.createContent.join('\n\n'),
            },
        });
    }

    //
    // create a child fragment
    //
    public createChild(name: string, node: ParsedNode): Fragment {
        return new Fragment(this.baseCode, { 
            name, 
            node, 
            parent: this,
        });
    }

    //
    // constructor code
    //
    get content() {
        return {
            append: content => {
                if (typeof content === 'string') {
                    content = deindent(content);
                }

                this.constructorContent.push(content)
            }
        }
    }

    get constructorCode() {
        if (this.constructorContent.length > 0) {
            return new Code(this.constructorContent.join('\n\n'));
        }

        return null;
    }

    //
    // get the name of a fragment variable
    //
    public define(obj: Object, desiredName: string = 'unknown') {
        // check to see if we've already defined variables for this object
        let definedObject = this.definedVars.find(defined => defined.obj === obj);

        // and if not, create a new container for our variable definitions
        if (!definedObject) {
            definedObject = { obj, definitions: {} };
            this.definedVars.push(definedObject);
        }

        // define this var if we haven't done so already
        if (typeof definedObject.definitions[desiredName] === 'undefined') {
            let nameIndex = 1;
            let currentName = desiredName;

            // create an array of all the currently taken variable names
            const takenVars = this.baseCode.reservedIdentifiers.concat(
                ...this.definedVars.map(definedObj => {
                    return Object.keys(definedObj.definitions)
                        .map(key => definedObj.definitions[key]);
                }),
            );

            // find a variable name that isn't taken
            while (takenVars.indexOf(currentName) > -1) {
                currentName = `${desiredName}_${nameIndex++}`;
            }

            definedObject.definitions[desiredName] = currentName;
        }

        return definedObject.definitions[desiredName];
    }

    //
    // define fragment vars
    //
    get definedVarsCode() {
        const varNames = this.definedVars.map(definedObj => {
            return Object.keys(definedObj.definitions)
                .map(key => definedObj.definitions[key]);
        });

        if (varNames.length > 0) {
            return new Code(`
                var ${varNames.join(', ')};
            `);
        }
        
        return null;
    }

    //
    // destroy
    //
    get destroy() {
        return {
            append: content => {
                if (typeof content === 'string') {
                    content = deindent(content);
                }

                this.destroyContent.push(content)
            }
        }
    }

    get destroyFunction() {
        if (this.destroyContent.length === 0) return '@noop';

        return new Code(`
            function destroy() {
                %content
            }
        `, {
            partials: {
                content: this.destroyContent.join('\n\n'),
            },
        });
    }

    //
    // hydrate
    //
    get hydrate() {
        return {
            append: content => {
                if (typeof content === 'string') {
                    content = deindent(content);
                }

                this.hydrateContent.push(content)
            }
        }
    }

    get hydrateFunction() {
        if (this.hydrateContent.length === 0) return '@noop';

        return new Code(`
            function hydrate() {
                %content
            }
        `, {
            partials: {
                content: this.hydrateContent.join('\n\n'),
            },
        });
    }
    
    //
    // mount
    //
    get mount() {
        return {
            append: content => {
                if (typeof content === 'string') {
                    content = deindent(content);
                }

                this.mountContent.push(content)
            }
        }
    }

    get mountFunction() {
        if (this.mountContent.length === 0) return '@noop';

        return new Code(`
            function mount(#target, #anchor) {
                %content
            }
        `, {
            partials: {
                content: this.mountContent.join('\n\n'),
            },
        });
    }

    //
    // signature
    //
    get signature() {
        let signature = ['#vm'];

        let parent = this.parent;

        while (parent) {
            signature = signature.concat(parent.scopedVars);
            parent = parent.parent;
        }

        return signature.concat(this.scopedVars);
    }

    //
    // unmount
    //
    get unmount() {
        return {
            append: content => {
                if (typeof content === 'string') {
                    content = deindent(content);
                }

                this.unmountContent.push(content)
            }
        }
    }

    get unmountFunction() {
        if (this.unmountContent.length === 0) return '@noop';

        return new Code(`
            function unmount() {
                %content
            }
        `, {
            partials: {
                content: this.unmountContent.join('\n\n'),
            },
        });
    }

    //
    // update
    //
    get update() {
        return {
            append: content => {
                if (typeof content === 'string') {
                    content = deindent(content);
                }

                this.updateContent.push(content)
            }
        }
    }

    get updateFunction() {
        if (this.updateContent.length === 0) return '@noop';

        return new Code(`
            function update(#changed) {
                %content
            }
        `, {
            partials: {
                content: this.updateContent.join('\n\n'),
            },
        });
    }

    // 
    // cast to a string
    //
    public toString(): string {
        return this.code.toString();
    }
}