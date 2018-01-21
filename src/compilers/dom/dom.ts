const pkg = require('../../../package.json');

import * as helpers from './helpers';
import Code from '../../generators/code';

//
// compile dom code
//
export default function (parsedSource, options) {
    const source = new Code(`
        // bia v${pkg.version}

        :helpers

        %componentConstructor
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

            if (options.el) {
                this.$el = fragment.c();
                fragment.m(options.el, options.anchor || null);
            }
        }
    `);
}

//
// fragment processing
//
function processFragments(currentNode, options) {
    
}