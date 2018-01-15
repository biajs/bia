import { code, expect, render } from '../../utils';

it.skip('element_with_static_classes', function() {
    const template = `
        <template>
            <div>
                <p class="bar"></p>
                <p b-if="true">
                    <span class="foo"></span>
                </p>
            </div>
        </template>
    `;

    const options = {};

    // const output = code(template, options);
    // console.log(output);

    const vm = render(template, options);
    expect(vm.$el.outerHTML).to.equal('<div><p class="bar"></p><p><span class="foo"></span></p></div>');
});