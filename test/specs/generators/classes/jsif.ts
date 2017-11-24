import { JsIf } from '../../../../src/generators/classes';
import { Code } from '../../../../src/generators/classes/Code';
import { expect } from 'chai';

describe('JsIf', () => {
    it('is constructed with a condition', () => {
        const branch = new JsIf({
            condition: 'foo === bar',
        });

        expect(branch.condition).to.equal('foo === bar');
    });

    it('treats if content, else if content, and else content as descendent code', () => {
        const branch = new JsIf({
            condition: 'foo',
            content: [
                new Code({ id: 'if' }),
            ],
            elseIf: [
                new JsIf({ 
                    condition: 'bar', 
                    id: 'elseIf',
                    elseIf: [
                        new JsIf({ id: 'elseIf2', condition: 'baz' })
                    ],
                    else: [
                        new Code({ id: 'else2' })
                    ],
                }),
            ],
            else: [
                new Code({ id: 'else' })
            ],
        });

        expect(branch.getDescendentIds()).to.deep.equal([
            'if', 
            'else',
            'elseIf',
            'else2',
            'elseIf2',
        ]);
    });

    it('throws an error if descendent code has a duplicate id', () => {
        expect(() => new JsIf({
            id: 'foo',
            condition: '1',
            content: [
                new Code({ id: 'foo' }),
            ],
        })).to.throw(
            'Invalid code structure, duplicate id "foo" defined.'
        );
    });

    it('can be cast to a string', () => {
        const branch = new JsIf({
            condition: 'foo === bar',
            content: ['return 123;'],
        });

        expect(String(branch)).to.equal('if (foo === bar) {\n    return 123;\n}');
    });
    
    it('can be cast to a string, with else/if branches', () => {
        const branch = new JsIf({
            condition: 'foo === bar',
            content: ['return 1;'],
            elseIf: [
                new JsIf({
                    condition: 'foo === baz',
                    content: ['return 2;'],
                }),
            ],
        });

        expect(String(branch)).to.equal('if (foo === bar) {\n    return 1;\n} else if (foo === baz) {\n    return 2;\n}');
    });

    it('can be cast to a string, with else branch', () => {
        const branch = new JsIf({
            condition: 'foo === bar',
            content: ['return 1;'],
            else: ['return 2;'],
        });

        expect(String(branch)).to.equal('if (foo === bar) {\n    return 1;\n} else {\n    return 2;\n}');
    });
});