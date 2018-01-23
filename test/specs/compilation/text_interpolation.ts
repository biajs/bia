import { compile, expect, render } from '../../utils';

it.skip('text_interpolation', function() {
    const source = `
        <template>
            <div>
                <div>Hello {{ name }}</div>
                <div>Hello {{ name.toUpperCase() }}</div>
            </div>
        </template>
    `;

    const options = {
        data: {
            name: 'Bob',
        }
    };

    const output = compile(source, options);
    console.log(output);

    // const vm = render(source, options);
    // console.log(vm.$el.outerHTML);
});