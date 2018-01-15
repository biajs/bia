import { JsConditional } from '../../../../src/generators/dom/functions/JsConditional';
import { JsCode, JsFunction } from '../../../../src/generators/code/index';
import { ParsedNode } from '../../../../src/interfaces';
import { createParsedNode } from '../../../utils';
import { expect } from 'chai';

describe('JsConditional', () => {
    let rootCode;
    let fooNode = 

    beforeEach(() => {
        rootCode = new JsCode;
    });

    it('returns a fragment', () => {
        const conditional = new JsConditional({ rootCode });

        const foo = createParsedNode({
            directives: [{
                arg: null,
                expression: 'foo',
                isProcessed: false,
                modifiers: [],
                name: 'if',
            }],
        });

        const bar = createParsedNode({
            directives: [{
                arg: null,
                expression: 'bar',
                isProcessed: false,
                modifiers: [],
                name: 'else-if',
            }],
        });

        const baz = createParsedNode();

        conditional.addIf(foo, 'create_foo_fragment');
        conditional.addIf(bar, 'create_bar_fragment');
        conditional.addElse(baz, 'create_baz_fragment');

        expect(String(conditional)).to.equal(
            `function select_block_type(vm) {\n` +
            `    if (vm.foo) return create_foo_fragment;\n` +
            `    if (vm.bar) return create_bar_fragment;\n` +
            `    return create_baz_fragment;\n` +
            `}`
        );
    });
});