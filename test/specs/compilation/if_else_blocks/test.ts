import { compile, div, expect, render } from '../../../utils';

export default function(file) {
    it.skip('if_else_blocks', function() {
        // const { code } = compile(file);
        // console.log(code);

        const vm = render(file, { el: div() });
        expect(vm.$el.outerHTML).to.equal('<div><span>else branch</span></div>');
    });
}