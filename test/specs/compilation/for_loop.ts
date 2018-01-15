import { code, expect, render } from '../../utils';

it('for_loop', function() {
    const template = `
        <template>
            <ul>
                <li b-for="name in people">
                    name: {{ name }}
                </li>
            </ul>
        </template>
    `;

    const options = {
        data: {
            people: ['Jim', 'Mary', 'Bob'],
        },
    };

    // const output = code(template, options);
    // console.log(output);

    const vm = render(template, options);

    expect(vm.$el.querySelectorAll('li').length).to.equal(3);
    expect(vm.$el.querySelector('li:nth-child(1)').textContent.trim()).to.equal('name: Jim');
    expect(vm.$el.querySelector('li:nth-child(2)').textContent.trim()).to.equal('name: Mary');
    expect(vm.$el.querySelector('li:nth-child(3)').textContent.trim()).to.equal('name: Bob');
});