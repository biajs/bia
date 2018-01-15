import { code, expect, render } from '../../utils';

it.skip('nested_if_else_if_else_blocks', function() {
    const template = `
        <template>
            <div>
                <div b-if="true">
                    true 1
                    <div b-if="false">false 1</div>
                    <div b-if="false">false 2</div>
                    <div b-else-if="true">true 2</div>
                    <div b-else>false 3</div>
                </div>
                <div b-else-if="false">false 4</div>
                <div b-else>false 5</div>
            </div>
        </template>
    `;

    const options = {};

    // const output = code(template, options);
    // console.log(output);

    const vm = render(template, options);
    expect(vm.$el.outerHTML).to.equal('<div><div>true 1<div>true 2</div></div></div>');

    // @todo: flesh out this test
});