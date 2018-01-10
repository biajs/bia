import { compile, div, expect, render } from '../../../utils';

export default function(file) {
    it('for_loop', () => {
        // const { code } = compile(file);
        // console.log(code);

        const vm = render(file, { 
            el: div(),
            data: {
                bar: [1, 2, 3],
            },
        });

        // @todo: make assertion that each text node is correct
        expect(vm.$el.querySelectorAll('span').length).to.equal(3);
    });
}