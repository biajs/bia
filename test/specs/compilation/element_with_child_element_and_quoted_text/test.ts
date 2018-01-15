import { div, expect, render } from '../../../utils';

export default function(file) {
    it.skip('element_with_child_element_and_quoted_text', function() {
        const vm = render(file, { el: div() });

        expect(vm.$el.innerHTML.trim()).to.equal(`<span>one "two" 'three'</span>`);
    });
}