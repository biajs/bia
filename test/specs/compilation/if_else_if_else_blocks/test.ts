import { compile, div, expect, render } from '../../../utils';

export default function(file) {
    it.only('if_else_if_else_blocks', () => {
        const { code } = compile(file);
        console.log(code);

        // const vm = render(file, { el: div() });
        // console.log(vm.$el.outerHTML);
    });
}