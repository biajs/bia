import { expect } from 'chai';

import { 
    escapeJsString,
    indent,
} from '../../../src/utils/string';

describe('string utilities', () => {
    it('escapeJavascriptString', () => {
        expect(escapeJsString(`"`)).to.equal('\\\"');
        expect(escapeJsString(`'`)).to.equal('\\\'');
        expect(escapeJsString(`\n`)).to.equal('\\r\\n');
    });

    it('indent', () => {
        expect(indent('a single line')).to.equal('    a single line');
        expect(indent('line one\nline two')).to.equal('    line one\n    line two');
    });
});