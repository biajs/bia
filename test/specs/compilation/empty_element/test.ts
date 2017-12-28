import { div, expect, render } from '../../../utils';

export default function(file) {
    it('element_with_quoted_text', () => {
        const vm = render(file, { el: div() });

        expect(vm.$el.outerHTML).to.equal('<div></div>');
    });
}