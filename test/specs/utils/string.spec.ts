import { expect } from 'chai';
import { 
    escapeQuotes,
    indent,
} from '../../../src/utils/string';

describe('string utilities', () => {
    it('escapeQuotes', () => {
        expect(escapeQuotes(`'foo'`)).to.equal('&#39;foo&#39;');
        expect(escapeQuotes(`"bar"`)).to.equal('&#34;bar&#34;');
    });

    it('indent', () => {
        expect(indent('a single line')).to.equal('    a single line');
        expect(indent('line one\nline two')).to.equal('    line one\n    line two');
    });
});