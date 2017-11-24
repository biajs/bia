import { Code, JsObject } from '../../../../src/generators/classes';
import { expect } from 'chai';

describe('JsObject', () => {
    it('treats properties as descendent code', () => {
        const obj = new JsObject({
            id: 'foo',
            properties: {
                bar: new JsObject({ id: 'bar' }),
                baz: new JsObject({ 
                    id: 'baz',
                    properties: {
                        yar: new JsObject({ id: 'yar' }),
                    },
                }),
            },
        });

        expect(obj.getDescendentIds()).to.deep.equal(['bar', 'baz', 'yar']);
    });

    it('validates that ids are unique');

    it('can check for the existence of properties', () => {
        const obj = new JsObject({
            properties: {
                foo: new JsObject({}),
            },
        });

        expect(obj.hasProperty('foo')).to.be.true;
        expect(obj.hasProperty('bar')).to.be.false;
    });

    it('can add a property', () => {
        const obj = new JsObject({});

        obj.addProperty('foo', new JsObject({}));
        
        expect(String(obj)).to.equal('{\n    foo: {}\n}');
    });

    it('can remove a property', () => {
        const obj = new JsObject({
            properties: {
                foo: new JsObject({}),
                bar: new JsObject({}),
            },
        });

        obj.removeProperty('foo');

        expect(String(obj)).to.equal('{\n    bar: {}\n}');
    });

    it('can get a property', () => {
        let foo = new JsObject({});
        let bar = new JsObject({ properties: { foo } });

        expect(bar.getProperty('foo')).to.equal(foo);
    });
    
    it('throws an error if adding a property that already exists', () => {
        const obj = new JsObject({
            properties: { foo: new JsObject({}) },
        });

        expect(() => obj.addProperty('foo', new JsObject({}))).to.throw(
            'Failed to add property "foo" to object, that key is already defined.'
        );
    });

    it('throws an error if removing a property that does not exist', () => {
        const obj = new JsObject({});

        expect(() => obj.removeProperty('foo')).to.throw(
            'Failed to remove property "foo" from object, that key is not defined.'
        );
    });

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