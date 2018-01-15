import { code, expect, render } from '../../utils';

it.only('element_with_nested_static_and_dynamic_children', function() {
    const template = `
        <template>
            <div>
                <span b-if="true">dynamic</span>
                static text
                <div>
                    nested static text
                    <p>nested static element</p>
                </div>
            </div>
        </template>
    `;

    const options = {};

    // const output = code(template, options);
    // console.log(output);

    const vm = render(template, options);
    expect(vm.$el.outerHTML).to.equal(`<div><span>dynamic</span> static text<div>nested static text<p>nested static element</p></div></div>`);
});