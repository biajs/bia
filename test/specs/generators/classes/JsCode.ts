import { JsCode } from '../../../../src/generators/classes/JsCode';
import { expect } from 'chai';

describe('JsCode', () => {
    it('can be instantiated with only an id', () => {
        const options = { id: 'foo' };
        const code = new JsCode(options);

        expect(code.id).to.equal('foo');
        expect(code.content).to.deep.equal([]);
        expect(code.options).to.equal(options);
    });

    it('can be instantiated with string content', () => {
        const code = new JsCode({ content: ['console.log(1)'] });

        expect(code.id).to.be.null;
        expect(code.content).to.deep.equal(['console.log(1)']);
    });

    it('throws an error if a child has a taken id', () => {
        expect(() => new JsCode({
            id: 'foo',
            content: [
                new JsCode({ 
                    content: [
                        new JsCode({ id: 'foo' }),
                    ],
                }),
            ],
        })).to.throw(
            'Invalid code structure, duplicate id "foo" defined.'
        );
    });

    it('can be cast to a string', () => {
        // convert code with only string content
        expect(String(new JsCode({
            content: [
                `let foo = 1;`,
                `console.log(foo);`
            ],
        }))).to.equal('let foo = 1;\nconsole.log(foo);');
  
        // convert code with string and child code
        expect(String(new JsCode({
            content: [
                'let bar = 2;',
                new JsCode({ content: ['console.log(bar);'] }),
            ],
        }))).to.equal('let bar = 2;\nconsole.log(bar);');
    });
});