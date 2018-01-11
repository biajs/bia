import { compile, div, expect, render } from '../../../utils';

export default function(file) {
    it('text_interpolation', () => {
        // const { code } = compile(file);
        // console.log(code);

        const vm = render(file, { 
            el: div(),
            data: {
                one: 'hello',
                two: 'world',
            }
        });

        expect(vm.$el.textContent).to.equal('hello static world');
    });
}