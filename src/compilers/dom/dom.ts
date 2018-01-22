const pkg = require('../../../package.json');

import * as helpers from './helpers';
import Code from '../../generators/code';
import Fragment from '../../generators/fragment';
import processors from './processors/_index';
import { ParsedNode } from '../../interfaces';

//
// compile dom code
//
export default function (parsedSource, options) {
    const source = new Code(`
        // bia v${pkg.version}
        var #changedState = {}, #isUpdating = false, #queue = [];

        //
        // helpers
        //
        :helpers

        //
        // fragments
        //
        :fragments

        //
        // constructor
        //
        %componentConstructor

        return #${options.name};
    `, {
        helpers,
        reservedIdentifiers: [
            // @todo: include identifiers from the <script> block
        ],
    });

    source.addPartial('componentConstructor', getConstructor(source, options));

    // define our main fragment and start processing the template
    const mainFragment = new Fragment(source, 'create_main_fragment');
    processFragments(source, parsedSource.template, mainFragment);

    return source.toString();
}

//
// component constructor
//
function getConstructor(source: Code, options) {
    const name = options.name;

    return new Code(`
        function #${name}(options) {
            this.$state = @assign({}, options.data);
            @init(this, options);
            @proxy(this, this.$state);

            // define fragment
            var fragment = #create_main_fragment(this);

            @observe(this.$state, [], fragment.p);

            if (options.el) {
                this.$el = fragment.c();
                // fragment.m(options.el, options.anchor || null);
            }
        }
    `);
}

//
// recursively process fragments
//
function processFragments(source: Code, currentNode: ParsedNode, fragment: Fragment) {
    let childFragment = null;

    // pass the current node through each processor
    processors.forEach(processor => {
        // give each processor the change to define a child fragment
        if (typeof processor.childFragment === 'function') {
            childFragment = processor.childFragment(source, currentNode, fragment);
        }

        // process the fragment
        if (typeof processor.process === 'function') {
            processor.process(source, currentNode, fragment);
        }
    });

    // if a child fragment was defined, start the process over again
    if (childFragment) {
        processFragments(source, currentNode, childFragment);
    }

    // otherwise process the child nodes under the same fragment
    else {
        currentNode.children.forEach(childNode => processFragments(source, childNode, fragment));
    }

    // and lastly, call any post processors that exist
    processors.forEach(processor => {
        if (typeof processor.postProcess === 'function') {
            processor.postProcess(source, currentNode, fragment);
        }
    });
}