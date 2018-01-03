import { JsClass, JsCode, JsFunction } from '../../../../src/generators/code';
import { expect } from 'chai';

describe('JsClass', () => {
    it('can have a constructor', () => {
        const Foo = new JsClass({ 
            name: 'Foo',
            signature: ['a', 'b', 'c'],
            content: ['// constructor'],
        });

        expect(Foo.toString()).to.equal(`class Foo {\n    constructor(a, b, c) {\n        // constructor\n    }\n}`);
    });

    it('can have methods', () => {
        const Foo = new JsClass({ 
            name: 'Foo',
            methods: {
                hello: { content: ['// hello'] },
            },
        });

        expect(Foo.toString()).to.equal(`class Foo {\n    hello() {\n        // hello\n    }\n}`);
    });

    it('tracks descendent code', () => {
        const a = new JsCode;
        const b = new JsCode;
        const c = new JsCode;

        const Foo = new JsClass({ 
            name: 'Foo', 
            content: [a],
            methods: {
                hello: { content: [b] },
                world: { content: [c] },
            },
        });

        expect(Foo.getDescendents()).to.deep.equal([a, b, c]);
    });
});