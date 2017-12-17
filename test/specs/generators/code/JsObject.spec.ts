import { JsFunction, JsObject } from '../../../../src/generators/code';
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

    it('validates that ids are unique', () => {
        expect(() => new JsObject({
            id: 'foo',
            properties: {
                foo: new JsObject({ id: 'foo' }),
            },
        })).to.throw(
            'Failed to construct code tree, the ID "foo" occured multiple times.'
        );
    });

    it('throws an error if a duplicate id is added', () => {
        const obj1 = new JsObject({ id: 'obj1' });
        const obj2 = new JsObject({ id: 'obj2' });
        
        expect(() => obj1.addProperty('foo', new JsObject({ id: 'obj1' }))).to.throw(
            'Failed to add property "foo", doing so would create a duplicate "obj1" id.'
        );

        expect(() => obj2.addProperty('foo', new JsObject({
            properties: {
                foo: new JsObject({ id: 'obj2' }),
            },
        }))).to.throw(
            'Failed to add property "foo", doing so would create a duplicate "obj2" id.'
        );;
    })

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

    it('sets the parent property of descendent code properties', () => {
        const someMethod = new JsFunction;
        const obj = new JsObject({
            properties: {
                someMethod,
            },
        });

        expect(someMethod.parent).to.equal(obj);
    });

    it('casts complex objects to a string');
});