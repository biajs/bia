import {
    deindent,
} from '../../utils/string';

interface CodeOptions {
    helpers: Object,
    containers: Array<any>,
}

export default function(source, options = null) {
    if (options === null) options = {};
    if (typeof options.containers === 'undefined') options.containers = {};
    if (typeof options.helpers === 'undefined') options.helpers = {};
    if (typeof options.partials === 'undefined') options.partials = {};

    const block = {

        // append child code to a container
        append(child, container) {
            if (typeof options.containers[container] === 'undefined') {
                options.containers[container] = [];
            }

            options.containers[container].push(child);
        },

        //
        // parent code instance
        //
        parent: options.parent || null,

        //
        // deindented raw source
        //
        rawSource: source,

        //
        // cast the code object to a string
        //
        toString() {
            let output = deindent(source);

            // containers

            // replace partials
            output = replacePartials(options, output);

            // if we are the root instance, find any helpers that have
            // been used and make sure to include them in the output
            if (isRoot(this)) output = replaceHelpers(options, output);

            // replace containers
            // output = replaceContainers(options, output);

            return output;
        },
    };

    // register partials
    registerChildPartials(block, options.partials);

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

    return output.replace(':helpers', used
        .map(helper => options.helpers[helper])
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