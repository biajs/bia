import { compile, div, expect, render } from '../../../utils';

export default function(file) {
    it.skip('for_loop', () => {
        // const { code } = compile(file);
        // console.log(code);

        const vm = render(file, { 
            el: div(),
            data: {
                people: ['Jim', 'Mary', 'Bob'],
            },
        });

        expect(vm.$el.querySelectorAll('li').length).to.equal(3);
        expect(vm.$el.querySelector('li:nth-child(1)').textContent.trim()).to.equal('name: Jim');
        expect(vm.$el.querySelector('li:nth-child(2)').textContent.trim()).to.equal('name: Mary');
        expect(vm.$el.querySelector('li:nth-child(3)').textContent.trim()).to.equal('name: Bob');
    });
}