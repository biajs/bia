import {
    deindent,
} from '../utils/string';

interface CodeOptions {
    helpers: Object,
    containers: Array<any>,
}

export default function(source, options = null) {
    const appendedSource = [];

    if (options === null) options = {};
    if (typeof options.containers === 'undefined') options.containers = {};
    if (typeof options.helpers === 'undefined') options.helpers = {};
    if (typeof options.partials === 'undefined') options.partials = {};

    const block = {

        // append child code to a container
        append(child, container = null) {
            if (typeof child === 'object' && typeof child.parent !== 'undefined') {
                child.parent = this;
            }

            // append to a container
            if (container) {
                if (typeof options.containers[container] === 'undefined') {
                    options.containers[container] = [];
                }

                options.containers[container].push(child);
            } 
            
            // append to main content
            else appendedSource.push(child);
        },

        //
        // parent code instance
        //
        parent: options.parent || null,

        //
        // deindented raw source
        //
        rawSource: source,

        // this property is computed, it's not actually null.
        // see the Object.defineProperty() call below.
        root: null,

        //
        // cast the code object to a string
        //
        toString() {
            let output = deindent(source);

            // append output added after creation
            if (appendedSource.length) {
                output += '\n\n' + deindent(appendedSource.join('\n\n'));
            }

            // replace partials
            output = replacePartials(options, output);

            // if we are the root instance, find any helpers that have
            // been used and make sure to include them in the output
            if (isRoot(this)) output = replaceHelpers(options, output);

            // replace containers
            output = replaceContainers(options, output);

            return output;
        },
    };

    // register partials
    registerChildPartials(block, options.partials);

    // expose a computed "root" property
    Object.defineProperty(block, 'root', {
        get() {
            let parent = block.parent;
            while (parent.parent) parent = parent.parent;
            return parent;
        },
    });

    return block;
}

// find the indentation of a line at a particular offset
function findIndentationAtOffset(source, offset) {
    return source.slice(0, offset).split('\n').pop().match(/^\s*/g);
}

// determine if a code object is the root instance
function isRoot(c) {
    return c.parent === null;
}

// register child partials with their parent
function registerChildPartials(parent, partials) {
    Object.keys(partials).forEach(name => {
        if (typeof partials[name] !== 'string')
            partials[name].parent = this;
    });
}

function replaceContainers(options, output) {
    return output.replace(/:\w+/g, (prefixedContainer, offset) => {
        const container = prefixedContainer.slice(1);

        return typeof options.containers[container] !== 'undefined'
            ? options.containers[container].join('\n\n')
            : '';
    });
}

// replace helpers with their code content
function replaceHelpers(options, output) {
    const used = [];

    output = output.replace(/@\w+/g, prefixedHelper => {
        const helper = prefixedHelper.slice(1);
        if (used.indexOf(helper) === -1) used.push(helper);
        return helper;
    });
    
    // for easier readability, alphabetize our helpers
    used.sort();

    return output.replace(':helpers', used
        .map(name => {
            const helper = options.helpers[name];

            if (!helper) {
                throw `Helper function "${name}" not found.`;
            }

            return helper;
        })
        .map(String)
        .map(deindent)
        .join('\n\n')
    );
}

// replace partials with their code content
function replacePartials(options, output) {
    return output.replace(/%\w+/g, (partial, offset) => {
        const name = partial.slice(1);

        const indentation = findIndentationAtOffset(output, offset);
        
        return deindent(String(options.partials[name]))
            .split('\n')
            .map((line, index) => index ? indentation + line : line)
            .join('\n');
    });
}