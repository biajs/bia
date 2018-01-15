import { code, expect, render } from '../../utils';

it.skip('nested_if_block', function() {
    const template = `
        <template>
            <div>
                <p b-if="true">
                    <span b-if="true">
                        <i b-if="true">yes</i>
                        <u b-if="false">no</u>
                    </span>
                </p>                    
            </div>
        </template>
    `;

    const options = {};

    // const output = code(template, options);
    // console.log(output);

    const vm = render(template, options);
    expect(vm.$el.outerHTML).to.equal('<div><p><span><i>yes</i></span></p></div>');

    // @todo: flesh out this test
});