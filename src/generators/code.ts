import {
    deindent,
    findLineAtOffset,
    findLineIndexAtOffset,
    isWhitespace,
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
    public appendedCode: Array<Object|string>
    public codeTemplate: string;
    public containers: Object;
    public helpers: Object;
    public identifiers: Object;
    public parent: Code|null;
    public partials: Object;
    public reservedIdentifiers: Array<string>;

    // constructor
    constructor(codeTemplate: string, options: CodeOptions = {}) {
        this.appendedCode = [];
        this.codeTemplate = codeTemplate;
        this.containers = {};
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
    public append(code: Object|string, container: string = null): void {
        if (code instanceof Code) {
            code.parent = this;
        }

        // append the code to a container
        if (container) {
            if (typeof this.containers[container] === 'undefined') {
                this.containers[container] = [];
            }

            this.containers[container].push(code);
        }

        // or append the code to the base content
        else this.appendedCode.push(code);
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

        // replace containers
        output = replaceContainers(this, output);

        // replace partials
        output = replacePartials(this, output);

        // if we're the root code instance, replace helpers and identifiers
        if (this.isRoot()) {
            // replace helpers in a loop so they can call other helpers
            while (output.match(/@\w+/g)) {
                output = replaceHelpers(this, output);
            }

            output = output.replace(':helpers\n\n', '');

            output = replaceIdentifiers(this, output);
        }

        // collapse unecessary empty lines
        output = output
            .replace(/(\n\s*){2,}\n/g, '\n\n') // collapse to a single empty line
            .replace(/\{\n(?:\s*|\n*)\n{1,}/g, '{\n') // remove newlines at the start of blocks

        return output;
    }
}

// find the indentation at a particular offset
function findIndentationAtOffset(source, offset) {
    return source.slice(0, offset).split('\n').pop().match(/^\s*/g);
}

// replace containers with their code content
function replaceContainers(code: Code, output: string): string {
    const emptyContainerLines = [];

    output = output.replace(/:\w+/g, (prefixedContainer, offset) => {
        const container = prefixedContainer.slice(1);
        const indentation = findIndentationAtOffset(output, offset);
        const line = findIndentationAtOffset(output, offset);

        // helpers are a special container, and are processed by the root code instance
        if (container === 'helpers') {
            return ':helpers';
        }

        // keep track of empty containers so we can remove empty lines
        if (typeof code.containers[container] === 'undefined') {
            emptyContainerLines.push(findLineIndexAtOffset(output, offset));
            return '';
        }

        // otherwise return our container content
        return code.containers[container]
            .map((line, index) => index ? indentation + line : line)
            .join('\n\n');
    });

    emptyContainerLines.sort();

    return output.split('\n').reduce((lines, currentLine, index) => {
        if (emptyContainerLines.indexOf(index) === -1 || !isWhitespace(currentLine)) {
            lines.push(currentLine);
        }

        return lines;
    }, []).join('\n');
}

// replace helpers with their code content
function replaceHelpers(code: Code, output: string): string {
    const usedHelpers = [];

    output = output.replace(/@\w+/g, prefixedHelper => {
        let name = prefixedHelper.slice(1);
        if (usedHelpers.indexOf(name) === -1) usedHelpers.push(name);
        return code.getIdentifier(name);
    });

    usedHelpers.sort();

    return output.replace(':helpers', ':helpers\n\n' + usedHelpers.map(name => {
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
        
        // if there is no partial content, return nothing
        if (code.partials[name] === null) {
            return '';
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