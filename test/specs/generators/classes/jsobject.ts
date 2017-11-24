import { Code, JsObject } from '../../../../src/generators/classes';
import { expect } from 'chai';

describe('JsObject', () => {
    it('treats properties as descendent code');

    it('validates that ids are unique');

    it('can add properties');

    it('can remove properties');

    it('casts empty objects to a string', () => {
        expect(String(new JsObject({}))).to.equal('{}');
    });

    it('casts objects with properties to a string', () => {
        expect(String(new JsObject({
            properties: {
                foo: new JsObject({}),
                bar: new JsObject({}),
            },
        }))).to.equal(`{\n    foo: {},\n    bar: {}\n}`);
    });

    it('casts complex objects to a string');
});