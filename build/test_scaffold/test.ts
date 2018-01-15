import { code, expect, render } from '../../utils';

it('_NAME_', function() {
    const template = `
        <template>
            <div>

            </div>
        </template>
    `;

    const options = {};

    const output = code(template, options);
    console.log(output);

    // const vm = render(template, options);
    // expect(vm.$options.foo).to.equal('bar');
});