import { compile, div, expect, render } from '../../../utils';

export default function(file) {
    it.skip('show_directive', () => {
        // const { code } = compile(file);
        // console.log(code);

        const vm = render(file, { el: div() });
        expect(vm.$el.outerHTML).to.equal(`<div><p style="display: none;">hidden</p><span>visible</span></div>`);
    });
}