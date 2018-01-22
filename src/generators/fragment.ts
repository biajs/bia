import Code from './code';

export default class {
    public baseCode: Code;
    public content: Array<Code | string>;
    public create: Array<Code | string>;
    public definedVars: Object;
    public destroy: Array<Code | string>;
    public hydrate: Array<Code | string>;
    public mount: Array<Code | string>;
    public name: string;
    public unmount: Array<Code | string>;
    public update: Array<Code | string>;

    //
    // constructor
    //
    constructor(baseCode: Code, name: string) {
        this.baseCode = baseCode;
        this.content = [];
        this.create = [];
        this.definedVars = {};
        this.destroy = [];
        this.hydrate = [];
        this.mount = [];
        this.name = name;
        this.unmount = [];
        this.update = [];
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
    get createFunction() {
        if (this.create.length === 0) return '@noop';

        return new Code(`
            function create() {
                %content
            }
        `, {
            partials: {
                content: this.create,
            },
        });
    }

    //
    // constructor code
    //
    get constructorCode() {
        if (this.content.length > 0) {
            return new Code(this.content.join('\n\n'));
        }

        return null;
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
    get destroyFunction() {
        if (this.destroy.length === 0) return '@noop';

        return new Code(`
            function destroy() {
                %content
            }
        `, {
            partials: {
                content: this.destroy,
            },
        });
    }

    //
    // get the name of a fragment variable
    //
    public getVarName(obj: Object, desiredName: string = 'unknown') {
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
    // hydrate
    //
    get hydrateFunction() {
        if (this.hydrate.length === 0) return '@noop';

        return new Code(`
            function hydrate() {
                %content
            }
        `, {
            partials: {
                content: this.hydrate,
            },
        });
    }
    
    //
    // mount
    //
    get mountFunction() {
        if (this.mount.length === 0) return '@noop';

        return new Code(`
            function mount(target, anchor) {
                %content
            }
        `, {
            partials: {
                content: this.mount,
            },
        });
    }

    //
    // unmount
    //
    get unmountFunction() {
        if (this.unmount.length === 0) return '@noop';

        return new Code(`
            function unmount() {
                %content
            }
        `, {
            partials: {
                content: this.unmount,
            },
        });
    }

    //
    // update
    //
    get updateFunction() {
        if (this.update.length === 0) return '@noop';

        return new Code(`
            function update(changed) {
                %content
            }
        `, {
            partials: {
                content: this.update,
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