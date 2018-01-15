import { code, expect, render } from '../../utils';

it.skip('element_with_static_styles', function() {
    const template = `
        <template>
            <div>
                <p style="color: red"></p>
                <p b-if="true">
                    <span style="color: blue"></span>
                </p>
            </div>
        </template>
    `;

    const options = {};

    // const output = code(template, options);
    // console.log(output);

    const vm = render(template, options);
    expect(vm.$el.outerHTML).to.equal(`<div><p style="color: red;"></p><p><span style="color: blue"></span></p></div>`);
});