import {
    deindent,
} from '../utils/string';

interface CodeOptions {
    helpers?: Object,
    parent?: Code|null,
    partials?: Object,
    reservedIdentifiers?: Array<string>,
}

//
// Code
//
export default class Code {
    public appendedCode: Array<Code|string>
    public codeTemplate: string;
    public helpers: Object;
    public identifiers: Object;
    public parent: Code|null;
    public partials: Object;
    public reservedIdentifiers: Array<string>;

    // constructor
    constructor(codeTemplate: string, options: CodeOptions = {}) {
        this.appendedCode = [];
        this.codeTemplate = codeTemplate;
        this.helpers = options.helpers || {};
        this.identifiers = {};
        this.parent = options.parent || null;
        this.partials = options.partials || {};
        this.reservedIdentifiers = options.reservedIdentifiers || [];

        // set the parent properties of any helpers passed in
        Object.keys(this.helpers)
            .filter(name => this.helpers[name] instanceof Code)
            .forEach(name => this.helpers[name].parent = this);

        // set the parent properties of any partials passed in
        Object.keys(this.partials)
            .filter(name => this.partials[name] instanceof Code)
            .forEach(name => this.partials[name].parent = this);
    }

    //
    // add a partial
    //
    public addPartial(name: string, code: Code|string): void {
        if (typeof this.partials[name] !== 'undefined') {
            throw `Failed to add partial "${name}", that partial already exists.`;
        }

        if (code instanceof Code) {
            code.parent = this;
        }

        this.partials[name] = code;
    }

    //
    // append code
    //
    public append(code: Code|string): void {
        if (code instanceof Code) {
            code.parent = this;
        }

        this.appendedCode.push(code);
    }

    //
    // get a named identifier
    //
    public getIdentifier(name): string {
        let suffix = 1;
        let currentName = name;

        while (typeof this.identifiers[name] === 'undefined') {
            if (this.reservedIdentifiers.indexOf(currentName) === -1) {
                this.identifiers[name] = currentName;
            }

            currentName = `${name}_${suffix++}`;
        }

        return this.identifiers[name];
    }

    //
    // determine if this is the root code instance
    //
    public isRoot(): boolean {
        return this.parent === null;
    }

    //
    // find the root code instance
    //
    get root(): Code {
        let root: Code = this;

        while (root.parent) {
            root = root.parent;
        }

        return root;
    }

    //
    // cast to a string
    //
    public toString(output: string = null): string {
        if (!output) {
            output = deindent(this.codeTemplate);
        }

        // inject appended code
        if (this.appendedCode.length) {
            output += '\n\n' + deindent(this.appendedCode.join('\n\n'));
        }

        // replace partials
        output = replacePartials(this, output);

        // if we're the root code instance, replace helpers and identifiers
        if (this.isRoot()) {
            output = replaceHelpers(this, output);
            output = replaceIdentifiers(this, output);
        }

        return output;
    }
}

// find the indentation at a particular offset
function findIndentationAtOffset(source, offset) {
    return source.slice(0, offset).split('\n').pop().match(/^\s*/g);
}

// function replaceContainers(options, output) {
//     return output.replace(/:\w+/g, (prefixedContainer, offset) => {
//         const container = prefixedContainer.slice(1);

//         return typeof options.containers[container] !== 'undefined'
//             ? options.containers[container].join('\n\n')
//             : '';
//     });
// }

// replace helpers with their code content
function replaceHelpers(code: Code, output: string) {
    const usedHelpers = [];

    output = output.replace(/@\w+/g, prefixedHelper => {
        let name = prefixedHelper.slice(1);
        if (usedHelpers.indexOf(name) === -1) usedHelpers.push(name);
        return code.getIdentifier(name);
    });

    usedHelpers.sort();

    return output.replace(':helpers', usedHelpers.map(name => {
            if (!code.helpers[name]) {
                throw `Helper function "${name}" not found.`;
            }

            return String(code.helpers[name]).replace(new RegExp(`\#${name}`), code.getIdentifier(name));
        })
        .map(String)
        .map(deindent)
        .join('\n\n')
    );
}

// replace identifiers
function replaceIdentifiers(code: Code, output: string): string {
    return output.replace(/#\w+/g, (name) => {
        return code.getIdentifier(name.slice(1));
    });
}

// replace partials with their code content
function replacePartials(code: Code, output: string): string {
    return output.replace(/%\w+/g, (partial, offset) => {
        const name = partial.slice(1);
        const indentation = findIndentationAtOffset(output, offset);

        if (typeof code.partials[name] === 'undefined') {
            throw `Partial "${name}" not found.`;
        }

        const partialContent = typeof code.partials[name] === 'function'
            ? code.partials[name].bind(code)()
            : code.partials[name];

        // if our dynamic patial returned a code instance, set the parent context
        if (typeof code.partials[name] === 'function' && partialContent instanceof Code) {
            partialContent.parent = code;
        }
        
        return deindent(String(partialContent))
            .split('\n')
            .map((line, index) => index ? indentation + line : line)
            .join('\n');
    });
}