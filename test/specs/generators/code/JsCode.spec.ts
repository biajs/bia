import { JsCode } from '../../../../src/generators/code/index';
import { expect } from 'chai';

describe.only('JsCode', () => {
    it('can be constructed without an id or content', () => {
        const code = new JsCode;

        expect(code.id).to.equal(null);
        expect(code.content).to.deep.equal([]);
    });

    it('sets the parent instance of constructed content', () => {
        let foo = new JsCode;
        let bar = new JsCode({ content: [foo] });

        expect(foo.parent).to.equal(bar);
    });

    it('sets the parent instance on append', () => {
        const foo = new JsCode;
        const bar = new JsCode;
        
        foo.append(bar);

        expect(bar.parent).to.equal(foo);
    });

    it('sets the parent instance on prepend', () => {
        const foo = new JsCode;
        const bar = new JsCode;

        foo.prepend(bar);

        expect(bar.parent).to.equal(foo);
    });

    it('sets the parent instance on insertAfter', () => {
        const foo = new JsCode({
            content: [
                new JsCode({ id: 'target' }),
            ],
        });

        const bar = new JsCode;

        foo.insertAfter(bar, 'target');

        expect(bar.parent).to.equal(foo);
    });

    it('sets the parent instance on insertBefore', () => {
        const foo = new JsCode({
            content: [
                new JsCode({ id: 'target' }),
            ],
        });

        const bar = new JsCode;

        foo.insertBefore(bar, 'target');

        expect(bar.parent).to.equal(foo);
    });

    it('can append and prepend code content', () => {
        const foo = new JsCode({ id: 'foo' });
        const bar = new JsCode({ id: 'bar' });
        const baz = new JsCode({ id: 'baz' });

        const code = new JsCode({ 
            content: [bar],
        });

        code.prepend(foo);
        code.append(baz);

        expect(code.content[0]).to.equal(foo);
        expect(code.content[1]).to.equal(bar);
        expect(code.content[2]).to.equal(baz);
        
        expect(foo.parent).to.equal(code);
        expect(baz.parent).to.equal(code);
    });

    it('can insert code before a particular id', () => {
        const foo = new JsCode({ id: 'foo' });
        const bar = new JsCode({ id: 'bar' });
        const baz = new JsCode({ id: 'baz' });

        const code = new JsCode({
            content: [foo, baz],
        });

        code.insertBefore(bar, 'baz');

        expect(code.content[0]).to.equal(foo);
        expect(code.content[1]).to.equal(bar);
        expect(code.content[2]).to.equal(baz);
    });

    it('can insert code after a particular id', () => {
        const foo = new JsCode({ id: 'foo' });
        const bar = new JsCode({ id: 'bar' });
        const baz = new JsCode({ id: 'baz' });

        const code = new JsCode({
            content: [foo, baz],
        });

        code.insertAfter(bar, 'foo');

        expect(code.content[0]).to.equal(foo);
        expect(code.content[1]).to.equal(bar);
        expect(code.content[2]).to.equal(baz);
    });

    it('can insert code after nested code', () => {
        const foo = new JsCode({ id: 'foo' });
        const bar = new JsCode({ id: 'bar' });
        const baz = new JsCode({ id: 'baz' });
        const yar = new JsCode({ id: 'yar' });

        foo.append(bar);
        bar.append(baz);

        foo.insertAfter(yar, 'baz');
        expect(yar.parent).to.equal(bar);
        expect(bar.content[0]).to.equal(baz);
        expect(bar.content[1]).to.equal(yar);
    });

    it('can insert before nested code', () => {
        const foo = new JsCode({ id: 'foo' });
        const bar = new JsCode({ id: 'bar' });
        const baz = new JsCode({ id: 'baz' });
        const yar = new JsCode({ id: 'yar' });

        foo.append(bar);
        bar.append(baz);

        foo.insertBefore(yar, 'baz');
        expect(yar.parent).to.equal(bar);
        expect(bar.content[0]).to.equal(yar);
        expect(bar.content[1]).to.equal(baz);
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
});