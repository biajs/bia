import { compile, div, expect, render } from '../../../utils';

export default function(file) {
    it('if_block', (done) => {
        // const { code } = compile(file);
        // console.log(code);

        const vm = render(file, { 
            el: div(),
            data: {
                foo: true,
            },
        });

        expect(vm.$el.outerHTML).to.equal('<div><span>hello</span></div>');

        vm.foo = false;

        // @todo: implement a nextTick function
        setTimeout(() => {
            expect(vm.$el.outerHTML).to.equal('<div></div>');
            done();
        }, 10);
    });
}