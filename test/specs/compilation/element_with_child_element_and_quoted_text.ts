import { code, expect, render } from '../../utils';

it('element_with_child_element_and_quoted_text', function() {
    const template = `
        <template>
            <div>
                <span>one "two" 'three'</span>
            </div>
        </template>
    `;

    const options = {};

    // const output = code(template, options);
    // console.log(output);

    const vm = render(template, options);
    expect(vm.$el.innerHTML.trim()).to.equal(`<span>one "two" 'three'</span>`);
});