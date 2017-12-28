import { div, expect, render } from '../../../utils';

export default function(file) {
    it('if_block', () => {
        const vm = render(file, { el: div() });

        expect(vm.$el.outerHTML).to.equal('<div><span>hello</span></div>');
    });
}