import { compile, div, expect, render } from '../../../utils';

export default function(file) {
    it.skip('nested_if_block', () => {
        const vm = render(file, { el: div() });

        expect(vm.$el.outerHTML).to.equal('<div><p><span><i>yes</i></span></p></div>');
    });
}