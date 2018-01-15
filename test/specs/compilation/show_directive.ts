import { code, expect, render } from '../../utils';

it('show_directive', function() {
    const template = `
        <template>
            <div>
                <p b-show="false">hidden</p>
                <span b-show="true">visible</span>
            </div>
        </template>
    `;

    const options = {};

    // const output = code(template, options);
    // console.log(output);

    const vm = render(template, options);
    expect(vm.$el.outerHTML).to.equal(`<div><p style="display: none;">hidden</p><span>visible</span></div>`);

    // @todo: flesh out this test more
});