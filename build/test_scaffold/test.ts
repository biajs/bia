import { compile, expect, render } from '../../utils';

it.only('_NAME_', function() {
    const source = `
        <template>
            <div></div>
        </template>
    `;

    const options = {};

    const output = compile(source, options);
    console.log(output);

    // const vm = render(source, options);
    // console.log(vm.$el.outerHTML);
});