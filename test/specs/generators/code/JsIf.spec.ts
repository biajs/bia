import { JsCode, JsIf } from '../../../../src/generators/code/index';
import { expect } from 'chai';

describe.skip('JsIf', () => {
    it('can be cast to a string', () => {
        const code = new JsIf({
            condition: 'foo === bar',
            content: [
                'return 0;',
            ],
            elseIf: [
                {
                    condition: 'foo === baz',
                    content: [
                        'return 1;',
                    ],
                },
            ],
            else: [
                'return 2;',
            ],
        });

        expect(String(code)).to.equal('if (foo === bar) {\n    return 0;\n} else if (foo === baz) {\n    return 1;\n} else {\n    return 2;\n}');
    });

    it('treats all branches as descendent code', () => {
        const foo = new JsCode({ id: 'foo' });
        const fooChild = new JsCode({ id: 'fooChild' });
        const bar = new JsCode({ id: 'bar' });
        const barChild = new JsCode({ id: 'barChild' });
        const baz = new JsCode({ id: 'baz' });
        const bazChild = new JsCode({ id: 'bazChild' });

        foo.append(fooChild);
        bar.append(barChild);
        baz.append(bazChild);

        const code = new JsIf({
            condition: 'foo === bar',
            content: [foo],
            elseIf: [
                {
                    condition: 'foo === baz',
                    content: [bar],
                },
            ],
            else: [baz],
        });

       expect(code.getDescendentIds()).to.deep.equal(['foo', 'fooChild', 'bar', 'barChild', 'baz', 'bazChild']);
    })

    it('sets the parent property of all descendent code', () => {
        const foo = new JsCode;
        const bar = new JsCode;
        const baz = new JsCode;

        const code = new JsIf({
            condition: 'foo === bar',
            content: [foo],
            elseIf: [
                {
                    condition: 'foo === baz',
                    content: [bar],
                },
            ],
            else: [baz],
        });

        expect(foo.parent).to.equal(code);
        expect(bar.parent).to.equal(code);
        expect(baz.parent).to.equal(code);
    });
});