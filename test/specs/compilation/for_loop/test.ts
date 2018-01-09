import { compile, div, expect, render } from '../../../utils';

export default function(file) {
    it.skip('for_loop', () => {
        const { code } = compile(file);
        console.log(code);

        // const vm = render(file, { el: div() });
        // console.log(vm.$el.outerHTML);
    });
}