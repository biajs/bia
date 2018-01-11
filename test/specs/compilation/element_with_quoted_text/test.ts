import { compile, div, expect, render } from '../../../utils';

export default function(file) {
    it('element_with_quoted_text', () => {
        // const { code } = compile(file);
        // console.log(code);

        const vm = render(file, { el: div() });
        expect(vm.$el.outerHTML).to.equal(`<div>\r\n        one "two" 'three'\r\n    </div>`);
    });
}