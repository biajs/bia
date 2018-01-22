import { compile, expect, render } from '../../utils';

it('element_with_static_children', function() {
    const source = `
        <template>
            <div>
                <span>hello world</span>
            </div>
        </template>
    `;

    const options = {};

    // const output = compile(source, options);
    // console.log(output);

    const vm = render(source, options);
    expect(vm.$el.outerHTML).to.equal('<div><span>hello world</span></div>');
});