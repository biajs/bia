import { code, expect, render } from '../../utils';


it('component_options', function() {
    const template = `
        <template>
            <div></div>
        </template>
    `;

    const options = {
        foo: 'bar',
    };

    // const output = code(template, options);
    // console.log(output);

    const vm = render(template, options);
    expect(vm.$options.foo).to.equal('bar');
});