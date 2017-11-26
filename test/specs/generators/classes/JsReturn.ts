import { JsCode, JsObject, JsReturn } from '../../../../src/generators/classes';
import { expect } from 'chai';

describe('JsReturn', () => {
    it('can be cast to a string', () => {
        const value = new JsCode({ content: [`'foo'`] });
        const code = new JsReturn({ value });

        expect(String(code)).to.equal(`return 'foo';`);
    });

    it('tracks the return value as descendent code', () => {
        const nestedObj = new JsObject({ 
            id: 'nestedDescendent',
        });

        const obj = new JsObject({ 
            id: 'directDescendent', 
            properties: { nestedObj },
        });

        const code = new JsReturn({ 
            value: obj,
        });

        expect(code.getDescendents().map(d => d.code.id)).to.deep.equal([
            'nestedDescendent',
            'directDescendent',
        ]);
    });
});