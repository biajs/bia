import { compile, div, expect, render } from '../../../utils';

export default function(file) {
    it.skip('element_with_child_element', function() {
        // const { code } = compile(file);
        // console.log(code);

        const vm = render(file, { el: div() });
        expect(vm.$el.innerHTML.trim()).to.equal('<span>aloha</span>');
    });
}