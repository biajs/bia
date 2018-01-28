import { compile, expect, render } from '../../utils';

it('empty_element', function() {
    const source = `
        <template>
            <div></div>
        </template>
    `;

    // const output = compile(source);
    // console.log(output);

    const vm = render(source, {});
    expect(vm.$el.outerHTML).to.equal('<div></div>');
});