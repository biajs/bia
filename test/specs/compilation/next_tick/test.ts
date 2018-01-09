import { compile, div, expect, render } from '../../../utils';

export default function(file) {
    it('next_tick', (done) => {
        // const { code } = compile(file);
        // console.log(code);

        const vm = render(file, { 
            el: div(),
            data: {
                foo: true,
            },
        });
        
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
}