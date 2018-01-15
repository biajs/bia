import { expect } from 'chai';

import { 
    escape,
    indent,
} from '../../../src/utils/string';

describe.skip('string utilities', () => {
    it('escape', () => {
        expect(escape(`"`)).to.equal('\\\"');
        expect(escape(`'`)).to.equal('\\\'');
        expect(escape(`\n`)).to.equal('\\r\\n');
    });

    it('indent', () => {
        expect(indent('a single line')).to.equal('    a single line');
        expect(indent('line one\nline two')).to.equal('    line one\n    line two');
    });
});