import { Code } from '../../../../src/generators/classes/Code';
import { expect } from 'chai';

describe('Code', () => {
    it('can be instantiated with only an id', () => {
        const options = { id: 'foo' };
        const code = new Code(options);

        expect(code.id).to.equal('foo');
        expect(code.content).to.deep.equal([]);
        expect(code.options).to.equal(options);
    });

    it('can be instantiated with string content', () => {
        const code = new Code({ content: ['console.log(1)'] });

        expect(code.id).to.be.null;
        expect(code.content).to.deep.equal(['console.log(1)']);
    });

    it('throws an error if a child has a taken id', () => {
        expect(() => new Code({
            id: 'foo',
            content: [
                new Code({ 
                    content: [
                        new Code({ id: 'foo' }),
                    ],
                }),
            ],
        })).to.throw(
            'Invalid code structure, duplicate id "foo" defined.'
        );
    });
});