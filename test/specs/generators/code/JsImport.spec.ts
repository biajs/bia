import { JsImport } from '../../../../src/generators/code';
import { expect } from 'chai';

describe('JsImport', () => {
    it('can import a default object', () => {
        const code = new JsImport({
            name: 'foo',
            path: 'some/dependency',
        });

        expect(String(code)).to.equal(`import foo from 'some/dependency';`);
    });

    it('can import with destructuring', () => {
        const code = new JsImport({
            destructure: ['foo', 'bar'],
            path: 'some/dependency',
        });

        expect(String(code)).to.equal(`import { foo, bar } from 'some/dependency';`);
    });
});