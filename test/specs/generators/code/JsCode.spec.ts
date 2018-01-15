import { JsCode } from '../../../../src/generators/code';
import { expect } from 'chai';

describe.skip('JsCode', () => {
    it('can be cast to a string', () => {
        const code = new JsCode({
            content: [
                '// foo',
                '// bar',
            ],
        });

        expect(String(code)).to.equal('// foo\n// bar');
    });

    it('can contain other code instances', () => {
        const code = new JsCode({
            content: [
                '// foo',
                new JsCode({ content: ['// bar'] }),
            ],
        });

        expect(String(code)).to.equal('// foo\n// bar');
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

    it('can insert itself after nested code', () => {
        const foo = new JsCode({ id: 'foo' });
        const bar = new JsCode({ id: 'bar' });
        const baz = new JsCode({ id: 'baz' });

        foo.append(bar);

        baz.insertSelfAfter(bar);
        expect(foo.content[0]).to.equal(bar);
        expect(foo.content[1]).to.equal(baz);
    });

    it('can insert itself before nested code', () => {
        const foo = new JsCode({ id: 'foo' });
        const bar = new JsCode({ id: 'bar' });
        const baz = new JsCode({ id: 'baz' });

        foo.append(bar);

        baz.insertSelfBefore(bar);
        expect(foo.content[0]).to.equal(baz);
        expect(foo.content[1]).to.equal(bar);
    });

    it('can check if the code block is empty', () => {
        const foo = new JsCode;

        expect(foo.isEmpty()).to.be.true;

        foo.append('// foo');

        expect(foo.isEmpty()).to.be.false;
    });

    it('can generate unique variables names', () => {
        let foo = {};
        let bar = {};

        const code = new JsCode;

        expect(code.getVariableName(foo, 'div')).to.equal('div');
        expect(code.getVariableName(foo, 'div')).to.equal('div');
        expect(code.getVariableName(bar, 'div')).to.equal('div_1');

    });
});