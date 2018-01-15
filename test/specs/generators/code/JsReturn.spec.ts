import { JsCode, JsFunction, JsReturn } from '../../../../src/generators/code/index';
import { expect } from 'chai';

describe.skip('JsReturn', () => {
    it('can be cast to a string', () => {
        const code = new JsReturn({
            value: new JsFunction({
                content: ['// foo'],
            }),
        });

        expect(String(code)).to.equal(`return function () {\n    // foo\n};`);
    });

    it('accepts strings as the return value', () => {
        const code = new JsReturn({
            value: 'hello',
        });

        expect(code.getDescendentIds()).to.deep.equal([]);
        expect(String(code)).to.equal(`return hello;`);
    });

    it('sets the return value\'s parent property', () => {
        const foo = new JsFunction;
        const code = new JsReturn({ value: foo });

        expect(foo.parent).to.equal(code);
    });
    
    it('tracks the return object as descendent code', () => {
        const code = new JsReturn({
            value: new JsFunction({ 
                id: 'foo',
                content: [
                    new JsCode({ id: 'bar' }),
                ],
            }),
        });

        expect(code.getDescendentIds()).to.deep.equal(['foo', 'bar']);
    });
});