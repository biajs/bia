import { compile, div, expect, render } from '../../../utils';

export default function(file) {
    it('nested_if_else_if_else_blocks', () => {
        // const { code } = compile(file);
        // console.log(code);

        const vm = render(file, { el: div() });
        expect(vm.$el.outerHTML).to.equal('<div><div>\r\n            true 1\r\n            <div>true 2</div></div></div>');
    });
}