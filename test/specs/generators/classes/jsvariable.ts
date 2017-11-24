import { JsVariable, JsFunction, JsIf, JsCode} from '../../../../src/generators/classes';
import { expect } from 'chai';

describe('JsVariable', () => {
    it('can define a single variable with no value', () => {
        const output = new JsVariable({ name: 'foo' });

        expect(String(output)).to.equal('var foo;');
    });
    
    it('can define a single variable with a default value', () => {
        const output = new JsVariable({
            name: 'foo',
            value: 1
        });

        expect(String(output)).to.equal('var foo = 1;');
    });

    it('can define multiple variables with no values', () => {
        const vars = new JsVariable({
            define: ['foo', 'bar', 'baz'],
        });

        expect(String(vars)).to.equal('var foo, bar, baz;');
    });

    it('can define multiple variables with default values', () => {
        const vars = new JsVariable({
            define: [
                { name: 'foo', value: 1 },
                { name: 'bar', value: 2 },
                { name: 'baz', value: 3 },
            ],
        });

        expect(String(vars)).to.equal('var foo = 1, bar = 2, baz = 3;');
    });

    it('can define multiple variables with some default values', () => {
        const vars = new JsVariable({
            define: [
                'foo',
                { name: 'bar', value: 2 },
            ],
        });

        expect(String(vars)).to.equal('var foo, bar = 2;');
    });
});