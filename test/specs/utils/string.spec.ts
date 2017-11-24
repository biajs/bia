import { indent } from '../../../src/utils/string';
import { expect } from 'chai';

describe('string utilities', () => {
    it('indent', () => {
        expect(indent('a single line')).to.equal('    a single line');
        expect(indent('line one\nline two')).to.equal('    line one\n    line two');
    });
});