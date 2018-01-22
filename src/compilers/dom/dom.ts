const pkg = require('../../../package.json');

import * as helpers from './helpers';
import Code from '../../generators/code';
import Fragment from '../../generators/fragment';
import processors from './processors/_index';

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
// fragment processing
//
function processFragments(currentNode, options) {
    
}