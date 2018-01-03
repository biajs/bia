import { JsClass, JsFunction } from '../../../../src/generators/code';
import { expect } from 'chai';

describe('JsClass', () => {
    it('can be cast to a string', () => {
        let Foo = new JsClass({ 
            name: 'Foo',
            methods: {
                hello: {
                    signature: [],
                    content: ['// hello'],
                },
            },
        });

        expect(Foo.toString()).to.equal(`class Foo {\n    hello() {\n        // hello\n    }\n}`);
    });

    it('tracks method functions as descendent code');
});