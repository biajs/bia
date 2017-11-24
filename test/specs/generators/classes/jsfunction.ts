import { JsFunction } from '../../../../src/generators/classes';
import { Code } from '../../../../src/generators/classes/Code';
import { expect } from 'chai';

describe('JsFunction', () => {
    it('can be constructed without a signature', () => {
        const fn = new JsFunction({});

        expect (fn.signature).to.deep.equal([]);
    });

    it('can be constructed with a signature', () => {
        const fn = new JsFunction({ signature: ['foo', 'bar'] });

        expect(fn.signature).to.deep.equal(['foo', 'bar']);
    });

    it('can be constructed with content', () => {
        const fn = new JsFunction({ content: ['console.log(1);'] });
        
        expect(fn.content).to.deep.equal(['console.log(1);']);
    });

    it('can be constructed with a name', () => {
        const fn = new JsFunction({ name: 'foo' });
        
        expect(fn.name).to.equal('foo');
    });

    it('throws an error if a descendent contains a duplicate id', () => {
        expect(() => new JsFunction({
            id: 'foo',
            content: [
                new Code({ id: 'foo' }),
            ],
        })).to.throw(
            'Invalid code structure, duplicate id "foo" defined.'
        );
    });

    it('can be cast to a string)', () => {
        const fn = String(new JsFunction({
            name: 'sum',
            signature: ['a', 'b'],
            content: ['return a + b;'],
        }));

        expect(fn).to.equal('function sum(a, b) {\n    return a + b;\n}');

        // just for fun, lets run our function
        expect(eval(`(${fn})(1, 2)`)).to.equal(3);
    });
});