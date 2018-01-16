import { code, expect, render } from '../../utils';

it('if_else_if_else_blocks', function(done) {
    const template = `
        <template>
            <div>
                <p b-if="foo">foo</p>
                <s b-else-if="bar">bar</s>
                <u b-else>baz</u>
            </div>
        </template>
    `;

    const options = {
        data: {
            foo: true,
            bar: true,
        },
    };

    // const output = code(template, options);
    // console.log(output);

    const vm = render(template, options);
    expect(vm.$el.outerHTML).to.equal(`<div><p>foo</p></div>`);

    vm.foo = false;
    vm.$nextTick(() => {
        expect(vm.$el.outerHTML).to.equal(`<div><s>bar</s></div>`);

        vm.bar = false;
        vm.$nextTick(() => {
            expect(vm.$el.outerHTML).to.equal(`<div><u>baz</u></div>`);
            done();
        });
    });
});