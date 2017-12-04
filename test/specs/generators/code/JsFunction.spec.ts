import { JsFunction } from '../../../../src/generators/code';
import { expect } from 'chai';

describe('JsFunction', () => {
    it('can be constructed without a name or signature', () => {
        const fn = new JsFunction;

        expect(fn.name).to.be.null;
        expect(fn.signature).to.deep.equal([]);
    });

    it('can be cast to a string', () => {
        const fn = new JsFunction({
            name: 'foo',
            signature: ['one', 'two'],
            content: [
                `return one + two;`,
            ],
        });

        expect(String(fn)).to.equal(`function foo(one, two) {\n    return one + two;\n}`);

        // just for fun, lets run the function
        expect(eval(`(${fn})(1, 2)`)).to.equal(3);
    });

    it('can be an annonymous function', () => {
        const fn = new JsFunction({
            signature: ['one', 'two'],
            content: [
                `return one + two;`,
            ],
        });

        expect(String(fn)).to.equal(`function (one, two) {\n    return one + two;\n}`);
    });

    it('converts to noop when empty and unnamed', () => {
        const fn = new JsFunction;

        expect(String(fn)).to.equal('noop');
    });

    it('contains an array of variables to define', () => {
        const fn = new JsFunction({ content: ['// foo'] });

        fn.define('foo');

        expect(String(fn)).to.equal(`function () {\n    let foo;\n\n    // foo\n}`);
    })
})