import { code, expect, render } from '../../utils';

it('next_tick', function(done) {
    const template = `
        <template>
            <div>
                <p b-if="foo">hello</p>
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

    // we'll start out with the <p> tag visible
    expect(vm.$el.outerHTML).to.equal(`<div><p>hello</p></div>`);

    // changing foo will update the dom, but not until the next tick
    vm.foo = false;
    expect(vm.$el.outerHTML).to.equal(`<div><p>hello</p></div>`);

    // following the next tick, the dom should look different
    vm.$nextTick(() => {
        expect(vm.$el.outerHTML).to.equal(`<div></div>`);

        // and we'll go once more to test nesting nextTick callbacks
        vm.foo = true;
        expect(vm.$el.outerHTML).to.equal(`<div></div>`);

        vm.$nextTick(() => {
            expect(vm.$el.outerHTML).to.equal(`<div><p>hello</p></div>`);
            done();
        });
    });
});