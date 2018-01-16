import { code, expect, render } from '../../utils';

it('if_else_blocks', function(done) {
    const template = `
        <template>
            <div>
                <p b-if="foo">foo</p>
                <span b-else>bar</span>
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
    expect(vm.$el.outerHTML).to.equal(`<div><p>foo</p></div>`)

    vm.foo = false;

    vm.$nextTick(() => {
        expect(vm.$el.outerHTML).to.equal(`<div><span>bar</span></div>`)
        done();
    });
});