import { compile, div, expect, render } from '../../../utils';

export default function(file) {
    it.skip('element_with_static_styles', () => {
        // const { code } = compile(file);
        // console.log(code);

        const vm = render(file, { el: div() });
        expect(vm.$el.outerHTML).to.equal(`<div><p style="color: red;"></p><p>\n            <span style="color: blue"></span>\n        </p></div>`);
    });
}