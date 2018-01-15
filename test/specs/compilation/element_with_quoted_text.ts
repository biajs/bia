import { code, expect, render } from '../../utils';

it('element_with_quoted_text', function() {
    const template = `
        <template>
            <div>
                one "two" 'three'
            </div>
        </template>
    `;

    const options = {};

    // const output = code(template, options);
    // console.log(output);

    const vm = render(template, options);
    expect(vm.$el.outerHTML).to.equal(`<div>one "two" 'three'</div>`);
});