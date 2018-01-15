import { compile, div, expect, render } from '../../../utils';

export default function(file) {
    it.skip('element_with_nested_static_and_dynamic_children', function() {
        // const { code } = compile(file);
        // console.log(code);

        const vm = render(file, { el: div() });
        expect(vm.$el.outerHTML).to.equal(`<div><span>dynamic</span>\r\n        static text\r\n        <div>\n            nested static text\n            <p>nested static element</p>\n        </div></div>`);
    });
}