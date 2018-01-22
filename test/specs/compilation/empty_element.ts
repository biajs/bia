import { compile, expect, render } from '../../utils';

it('empty_element', function() {
    const template = `
        <template>
            <div></div>
        </template>
    `;

    const options = {};

    // const output = compile(template, options);
    // console.log(output);

    const vm = render(template, options);
    expect(vm.$el.outerHTML).to.equal('<div></div>');
});