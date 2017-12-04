import { JsCode, JsFunction } from '../../../../src/generators/code/index';
import { expect } from 'chai';

describe('BaseCode', () => {
    it('can be constructed without an id or content', () => {
        const code = new JsCode;

        expect(code.id).to.equal(null);
        expect(code.content).to.deep.equal([]);
    });

    it('throws an error if code is constructed with duplicate IDs', () => {
        expect(() => new JsCode({ 
            id: 'foo',
            content: [
                new JsCode({ id: 'foo' }),
            ]
        })).to.throw(
            `Failed to construct code tree, the ID "foo" occured multiple times.`
        );
    });

    it('sets the parent instance of constructed content', () => {
        let foo = new JsCode;
        let bar = new JsCode({ content: [foo] });

        expect(foo.parent).to.equal(bar);
    });

    it('can find it\'s root code instance', () => {
        const parent = new JsCode({ id: 'parent' });
        const child = new JsCode({ id: 'child' });
        const grandchild = new JsCode({ id: 'grandchild' });

        parent.append(child);
        child.append(grandchild);
        
        expect(grandchild.getRoot()).to.equal(parent);
    });

    it('can find descendent code', () => {
        const parent = new JsCode({ id: 'parent' });
        const child = new JsCode({ id: 'child' });
        const grandchild = new JsCode({ id: 'grandchild' });

        parent.append(child);
        child.append(grandchild);

        expect(parent.findDescendentCode(grandchild)).to.equal(grandchild);
        expect(parent.findDescendentCode('grandchild')).to.equal(grandchild);
    });

    it('can find related code', () => {
        const parent = new JsCode({ id: 'parent' });
        const foo = new JsCode({ id: 'foo' });
        const bar = new JsCode({ id: 'bar' });

        parent.append(foo);
        parent.append(bar);

        expect(bar.findRelatedCode(foo)).to.equal(foo);
        expect(foo.findRelatedCode(bar)).to.equal(bar);
        expect(bar.findRelatedCode('foo')).to.equal(foo);
        expect(foo.findRelatedCode('bar')).to.equal(bar);
        expect(parent.findRelatedCode('foo')).to.equal(foo);
        expect(parent.findRelatedCode('bar')).to.equal(bar);
    });

    it('returns itself as the root when there is no parent', () => {
        const foo = new JsCode;

        expect(foo.getRoot()).to.equal(foo);
    });

    it('can find the nearest function instance', () => {
        const foo = new JsCode;

        // create some deeply nested code so we can find the parent fn
        const code = new JsFunction({
            content: [
                new JsCode({
                    content: [
                        new JsCode({ content: [foo] }),
                    ],
                }),
            ],
        });

        expect(foo.getParentFunction()).to.equal(code);
    });

    it('can add helper functions as depenedencies');
});