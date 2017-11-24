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