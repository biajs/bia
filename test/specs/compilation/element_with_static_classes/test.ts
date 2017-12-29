import { compile, div, expect, render } from '../../../utils';

export default function(file) {
    it('element_with_static_classes', () => {
        // const { code } = compile(file);
        // console.log(code);

        const vm = render(file, { el: div() });
        expect(vm.$el.outerHTML).to.equal('<div><span class="foo bar"></span></div>');
    });
}