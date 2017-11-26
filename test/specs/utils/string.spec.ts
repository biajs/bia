import { expect } from 'chai';

import { 
    escapeJavascriptString,
    indent,
} from '../../../src/utils/string';

describe('string utilities', () => {
    it('escapeJavascriptString', () => {
        expect(escapeJavascriptString(`"`)).to.equal('\\\"');
        expect(escapeJavascriptString(`'`)).to.equal('\\\'');
        expect(escapeJavascriptString(`\n`)).to.equal('\\r\\n');
    });

    it('indent', () => {
        expect(indent('a single line')).to.equal('    a single line');
        expect(indent('line one\nline two')).to.equal('    line one\n    line two');
    });
});