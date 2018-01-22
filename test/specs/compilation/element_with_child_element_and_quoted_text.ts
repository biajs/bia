import { compile, expect, render } from '../../utils';

it('element_with_child_element_and_quoted_text', function() {
    const source = `
        <template>
            <div>
                <span>one "two" 'three'</span>
            </div>
        </template>
    `;

    const options = {};

    // const output = compile(source, options);
    // console.log(output);

    const vm = render(source, options);
    expect(vm.$el.outerHTML).to.equal(`<div><span>one "two" 'three'</span></div>`);
});