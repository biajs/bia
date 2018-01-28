import { compile, expect, render } from '../../utils';

it.only('_NAME_', function() {
    const source = `
        <template>
            <div></div>
        </template>
    `;

    const output = compile(source);
    console.log(output);

    // const vm = render(source, {});
    // console.log(vm.$el.outerHTML);
});