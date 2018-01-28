import { compile, expect, render } from '../../utils';

it('element_with_static_text', function() {
    const source = `
        <template>
            <div>hello world</div>
        </template>
    `;

    // const output = compile(source);
    // console.log(output);

    const vm = render(source, {});
    expect(vm.$el.outerHTML).to.equal('<div>hello world</div>');
});