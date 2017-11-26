import { JsCode, JsReturn } from '../../../../src/generators/classes';
import { expect } from 'chai';

describe('JsReturn', () => {
    it('can be cast to a string', () => {
        const value = new JsCode({ content: [`'foo'`] });
        const code = new JsReturn({ value });

        expect(String(code)).to.equal(`return 'foo';`);
    });

    it('tracks the return value as descendent code', () => {
        const value = new JsCode({ content: [`'foo'`] });
        const code = new JsReturn({ value });

        expect(code.getDescendents()).to.deep.equal([
            {
                code: value,
                parent: code,
            },
        ]);
    });
});