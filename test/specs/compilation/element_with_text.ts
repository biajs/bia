import { code, expect, render } from '../../utils';

it('element_with_text', function() {
    const template = `
        <template>
            <div>hello world</div>
        </template>
    `;

    const options = {};

    // const output = code(template, options);
    // console.log(output);

    const vm = render(template, options);
    expect(vm.$el.outerHTML).to.equal('<div>hello world</div>');
});