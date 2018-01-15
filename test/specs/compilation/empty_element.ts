import { code, expect, render } from '../../utils';

it('empty_element', function() {
    const template = `
        <template>
            <div></div>
        </template>
    `;

    const options = {};

    // const output = code(template, options);
    // console.log(output);

    const vm = render(template, options);
    expect(vm.$el.outerHTML).to.equal('<div></div>');
});