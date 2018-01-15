import { expect } from 'chai';

import { 
    getDuplicateMembers,
    hasDuplicateMembers,
} from '../../../src/utils/array';

describe.skip('array utilities', () => {
    it('findDuplicateMembers', () => {
        expect(getDuplicateMembers(['foo', 'bar', 'baz', 'bar'])).to.deep.equal(['bar']);
    });

    it('hasDuplicateMembers', () => {
        // primitives
        expect(hasDuplicateMembers([1, 2, 3])).to.be.false;
        expect(hasDuplicateMembers([1, 1, 2])).to.be.true;

        // objects
        const foo = {};
        const bar = {};
        expect(hasDuplicateMembers([foo, bar])).to.be.false;
        expect(hasDuplicateMembers([foo, foo])).to.be.true;
    });
});