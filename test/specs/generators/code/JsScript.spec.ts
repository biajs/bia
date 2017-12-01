import {
    JsCode,
    JsScript,
} from '../../../../src/generators/code/index';

import { expect } from 'chai';

describe.only('JsScript', () => {
    it('can be constructed without content', () => {
        const script = new JsScript;
        expect(script.content).to.deep.equal([]);
    });

    it('can append and prepend code content', () => {
        const foo = new JsCode({ id: 'foo' });
        const bar = new JsCode({ id: 'bar' });
        const baz = new JsCode({ id: 'baz' });

        const script = new JsScript({
            content: [
                bar
            ],
        });

        script.prepend(foo);
        script.append(baz);

        expect(script.content[0]).to.equal(foo);
        expect(script.content[1]).to.equal(bar);
        expect(script.content[2]).to.equal(baz);

        expect(foo.script).to.equal(script);
        expect(bar.script).to.equal(script);
        expect(baz.script).to.equal(script);
    });
});