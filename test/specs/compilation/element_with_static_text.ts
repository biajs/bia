import { compile, expect, render } from '../../utils';

it('element_with_static_text', function() {
    const source = `
        <template>
            <div>hello world</div>
        </template>
    `;

    const options = {};

    // const output = compile(source, options);
    // console.log(output);

    const vm = render(source, options);
    expect(vm.$el.outerHTML).to.equal('<div>hello world</div>');
});