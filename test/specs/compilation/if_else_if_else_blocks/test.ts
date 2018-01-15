import { compile, div, expect, render } from '../../../utils';

export default function(file) {
    it.skip('if_else_if_else_blocks', () => {
        // const { code } = compile(file);
        // console.log(code);

        const vm = render(file, { el: div() });
        expect(vm.$el.outerHTML).to.equal('<div><p>2</p></div>');
    });
}