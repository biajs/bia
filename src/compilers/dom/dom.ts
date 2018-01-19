import * as helpers from './helpers';
import code from '../../generators/code';
const pkg = require('../../../package.json');

//
// compile dom code
//
export default function (parsedSource, options) {
    return code(`
        // bia v${pkg.version}

        :helpers

        :fragments

        %constructor
    `, { 
        helpers, 
        partials: {
            constructor: componentConstructor(options),
        },
    }).toString();
}

//
// component constructor
//
function componentConstructor(options) {
    const constructorFn = options.name;

    return code(`
        function ${constructorFn}(options) {
            this.$state = @assign({}, options.data);
            @init(this, options);
            @proxy(this, this.$state);

            var fragment = create_main_fragment(this);

            if (options.el) {
                this.$el = fragment.c();
                fragment.m(options.el, options.anchor || null);
            }
        }
    `);
}