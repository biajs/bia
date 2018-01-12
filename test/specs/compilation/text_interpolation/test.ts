import { compile, div, expect, render } from '../../../utils';

export default function(file) {
    it('text_interpolation', (done) => {
        // const { code } = compile(file);
        // console.log(code);

        const vm = render(file, { 
            el: div(),
            data: {
                one: 'hello',
                two: {
                    three: 'world',
                },
            }
        });

        // assert that initial content is correct
        expect(vm.$el.textContent).to.equal('hello static world');

        // update our state, and assert that the dom is changed
        vm.one = 'goodbye';
        vm.two.three = 'nothing';

        vm.$nextTick(() => {
            expect(vm.$el.textContent).to.equal('goodbye static nothing');
            done();
        })
    });
}