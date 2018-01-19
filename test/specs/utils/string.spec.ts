import { expect } from 'chai';

import { 
    deindent,
    escape,
    indent,
} from '../../../src/utils/string';

describe('string utilities', () => {
    it('deindent', () => {
        // plain string
        expect(deindent('hello')).to.equal('hello');

        // single line indentation
        expect(deindent('   foo')).to.equal('foo');

        // leading and trailing whitespace
        expect(deindent(`
            foo
        `)).to.equal('foo')

        // indented text
        expect(deindent(`
            foo
                bar
                    baz
        `)).to.equal(`foo\n    bar\n        baz`);

        expect(deindent(`
            one

            two
            three
        `)).to.equal('one\n\ntwo\nthree');
    });

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