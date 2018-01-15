import { JsAssignment, JsFunction } from '../../../../src/generators/code';
import { expect } from 'chai';

describe.skip('JsAssignment', () => {
    it('can assign a raw value', () => {
        const assignment = new JsAssignment({ 
            left: 'foo', 
            right: '"hello"',
        });

        expect(String(assignment)).to.equal('foo = "hello";');
    });

    it('can assign a complex value', () => {
        let value = new JsFunction({ content: ['//'] });

        const assignment = new JsAssignment({
            left: 'foo',
            right: value,
        });

        expect(String(assignment)).to.equal(`foo = function () {\n    //\n}`);
    });

    it('tracks the assignment as descendent code', () => {
        let value = new JsFunction({ content: ['//'] });

        const assignment = new JsAssignment({
            left: 'foo',
            right: value,
        });

        expect(assignment.getDescendents()).to.deep.equal([value]);
    });
});