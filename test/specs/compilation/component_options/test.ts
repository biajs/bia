import { create } from '../../../../src/index';
import { div, expect, render } from '../../../utils';

export default function(file) {
    const source = `
        <template>
            <div></div>
        </template>
    `;

    it.only('component_options', function() {
        const Component = create(source, {
            filename: 'Component.bia',
            name: 'Component',
            format: 'fn',
        });

        const el = div();
        const vm = new Component({ el, foo: 'bar' });
        
        expect(vm.$options).to.deep.equal({ el, foo: 'bar' });
    });
}