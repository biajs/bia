import {
    deindent,
} from '../utils/string';

interface CodeOptions {
    helpers?: Object,
    parent?: Code|null,
    partials?: Object,
}

//
// Code
//
export default class Code {
    public appendedCode: Array<Code|string>
    public codeTemplate: string;
    public helpers: Object;
    public parent: Code|null;
    public partials: Object;

    // constructor
    constructor(codeTemplate: string, options: CodeOptions = {}) {
        this.appendedCode = [];
        this.codeTemplate = codeTemplate;
        this.helpers = options.helpers || {};
        this.parent = options.parent || null;
        this.partials = options.partials || {};

        // set the parent properties of any partials passed in
        Object.keys(this.partials)
            .filter(name => this.partials[name] instanceof Code)
            .forEach(name => this.partials[name].parent = this);
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

        // if we're the root code instance, 
        if (this.isRoot()) {
            output = replaceHelpers(this, output);
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
        const helper = prefixedHelper.slice(1);
        if (usedHelpers.indexOf(helper) === -1) usedHelpers.push(helper);
        return helper;
    });

    usedHelpers.sort();

    return output.replace(':helpers', usedHelpers.map(name => {
            if (!code.helpers[name]) {
                throw `Helper function "${name}" not found.`;
            }

            return code.helpers[name];
        })
        .map(String)
        .map(deindent)
        .join('\n\n')
    );
}

// replace partials with their code content
function replacePartials(code, output) {
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