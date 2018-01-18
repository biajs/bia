import {
    deindent,
} from '../../utils/string';

interface CodeOptions {
    helpers: Object,
}

export default function(source, rawOptions = {}) {
    const options: CodeOptions = {
        helpers: {},
        ...rawOptions,
    };

    const containers = {
        helpers: [],
    };
    
    const partials = {};

    source = deindent(source);

    return {

        // append child code to a container
        append(child, target) {
            
        },

        // the parent code instance
        parent: null,

        // keep track of the raw source
        rawSource: source,

        // cast the code object to a string
        toString() {
            let output = source;
            // containers

            // partials
            output = output.replace(/%\w+/g, partial => {
                return '// ' + partial;
            });

            // if we are the root instance, find any helpers that have
            // been used and make sure to include them in the output
            if (isRoot(this)) {
                const used = [];

                output = output.replace(/@\w+/g, prefixedHelper => {
                    const helper = prefixedHelper.slice(1);
                    if (used.indexOf(helper) === -1) used.push(helper);
                    return helper;
                });

                output = output.replace(':helpers', used
                    .map(helper => options.helpers[helper])
                    .map(String)
                    .map(deindent)
                    .join('\n\n')
                );
                // const usedHelpers = new Set;

                // output = source.replace(/@\w+/g, prefixedHelper => {
                //     const helper = prefixedHelper.slice(1);
                //     usedHelpers.add(helper);
                //     return helper;
                // });

                // usedHelpers.forEach(helper => containers.helpers.push(options.helpers[helper]));

                // output = output.replace(':helpers', containers.helpers
                //     .map(String)
                //     .map(deindent)
                //     .join('\n\n')
                // );
            }

            return output;
        },
    };
}

// helper function to determine if a code object is the root instance
function isRoot(c) {
    return c.parent === null;
}