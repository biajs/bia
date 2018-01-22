import Code from './code';

import {
    deindent,
} from '../utils/string';

export default class {
    public baseCode: Code;
    public constructorContent: Array<Code | string>;
    public createContent: Array<Code | string>;
    public definedVars: Object;
    public destroyContent: Array<Code | string>;
    public hydrateContent: Array<Code | string>;
    public mountContent: Array<Code | string>;
    public name: string;
    public unmountContent: Array<Code | string>;
    public updateContent: Array<Code | string>;

    //
    // constructor
    //
    constructor(baseCode: Code, name: string) {
        this.baseCode = baseCode;
        this.constructorContent = [];
        this.createContent = [];
        this.definedVars = {};
        this.destroyContent = [];
        this.hydrateContent = [];
        this.mountContent = [];
        this.name = name;
        this.unmountContent = [];
        this.updateContent = [];
    }

    //
    // code
    //
    get code() {
        return new Code(`
            function #${this.name}(vm) {
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
        // if we've already defined this variable, return the name
        for (let name in this.definedVars) {
            if (this.definedVars[name] === obj) return name;
        }

        // otherwise find a name that isn't taken and return that
        let nameIndex = 1;
        let currentName = desiredName;

        while (
            this.baseCode.reservedIdentifiers.indexOf(currentName) > -1 ||
            typeof this.definedVars[currentName] !== 'undefined'
        ) {
            currentName = `${desiredName}_${nameIndex++}`;
        }

        this.definedVars[currentName] = obj;

        return currentName;
    }

    //
    // define fragment vars
    //
    get definedVarsCode() {
        const varNames = Object.keys(this.definedVars);

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
            function mount(target, anchor) {
                %content
            }
        `, {
            partials: {
                content: this.mountContent.join('\n\n'),
            },
        });
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
            function update(changed) {
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