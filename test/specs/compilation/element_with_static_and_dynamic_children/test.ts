import { compile, div, expect, render } from '../../../utils';

export default function(file) {
    it.skip('element_with_static_and_dynamic_children', () => {
        // const { code } = compile(file);
        // console.log(code);

        const vm = render(file, { el: div() });
        expect(vm.$el.outerHTML).to.equal('<div><p>static 1</p><span>dynamic</span><p>static 2</p></div>');
    });
}