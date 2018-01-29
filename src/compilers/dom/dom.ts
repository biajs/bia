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
        // component
        //
        %component

        return #${options.name};
    `, {
        helpers,
        reservedIdentifiers: [
            // @todo: include identifiers from the <script> block
        ],
    });

    source.addPartial('component', getConstructor(source, options));

    // define our main fragment and start processing the template
    const mainFragment = new Fragment(source, {
        name: 'create_main_fragment',
        node: parsedSource.template,
    });

    source.append(mainFragment, 'fragments');

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
                fragment.m(options.el, options.anchor || null);
            }
        }

        @assign(#${name}.prototype, {
            $emit: @emit,
            $nextTick: @nextTick,
            $on: @on,
        });
    `);
}

//
// recursively process fragments
//
function processFragments(source: Code, currentNode: ParsedNode, fragment: Fragment) {

    // give each processor the change to define a child fragment
    let childFragment = null;

    processors.forEach(processor => {
        if (!childFragment && typeof processor.childFragment === 'function') {
            childFragment = processor.childFragment(source, currentNode, fragment);
        }        
    });

    // append the child fragment if one was defined
    if (childFragment) {
        source.append(childFragment, 'fragments');
    }

    // process the current node
    processors.forEach(processor => {
        if (typeof processor.process === 'function') {
            processor.process(source, currentNode, fragment, childFragment);
        }
    });

    // recursively process each child node with their correct fragment
    const fragmentContext = childFragment || fragment;

    currentNode.children.forEach(childNode => processFragments(source, childNode, fragmentContext));

    // and lastly, call any post processors that exist
    processors.forEach(processor => {
        if (typeof processor.postProcess === 'function') {
            processor.postProcess(source, currentNode, fragment, childFragment);
        }
    });
}