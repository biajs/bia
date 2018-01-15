import { compile, div, expect, render } from '../../../utils';

export default function(file) {
    it.skip('static_text_node', () => {
        // const { code } = compile(file);
        // console.log(code);

        const vm = render(file, { el: div() });
        expect(vm.$el.textContent.trim()).to.equal('hello world');
    });
}