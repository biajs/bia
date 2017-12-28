import { div, expect, render } from '../../../utils';

export default function(file) {
    it('element_with_child_element', () => {
        const vm = render(file, { el: div() });

        expect(vm.$el.innerHTML.trim()).to.equal('<span>aloha</span>');
    });
}