import { compile } from '../../../../src/index';
import { div, expect, render } from '../../../utils';

export default function(file) {
    const source = `
        <template>
            <div></div>
        </template>
    `;

    it.only('component_options', function() {
        const result = compile(source, {
            filename: 'Component.bia',
            name: 'Component',
            format: 'fn',
        });

        console.log(result);

        // const el = div();
        // const vm = render(file, { el, foo: 'bar' });
        
        // expect(vm.$options).to.deep.equal({ el, foo: 'bar' });
    });
}