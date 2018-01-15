import { code, expect, render } from '../../utils';

it('if_block', function(done) {
    const template = `
        <template>
            <div>
                <span b-if="foo">hello</span>
            </div>
        </template>
    `;

    const options = {
        data: {
            foo: true,
        },
    };

    // const output = code(template, options);
    // console.log(output);

    const vm = render(template, options);

    expect(vm.$el.outerHTML).to.equal('<div><span>hello</span></div>');

    vm.foo = false;

    vm.$nextTick(() => {
        expect(vm.$el.outerHTML).to.equal('<div></div>');
        done();
    });
});