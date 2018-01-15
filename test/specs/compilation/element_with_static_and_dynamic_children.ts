import { code, expect, render } from '../../utils';

it('element_with_static_and_dynamic_children', function() {
    const template = `
        <template>
            <div>
                <p>static 1</p>
                <span b-if="true">dynamic</span>
                <p>static 2</p>
            </div>
        </template>
    `;

    const options = {};

    // const output = code(template, options);
    // console.log(output);

    const vm = render(template, options);
    expect(vm.$el.outerHTML).to.equal('<div><p>static 1</p><span>dynamic</span><p>static 2</p></div>');
});