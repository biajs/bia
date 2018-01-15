import { code, expect, render } from '../../utils';

it('text_interpolation', function(done) {
    const template = `
        <template>
            <div>{{ one }} static {{ two.three }}</div>
        </template>
    `;

    const options = {
        data: {
            one: 'hello',
            two: {
                three: 'world',
            },
        },
    };

    // const output = code(template, options);
    // console.log(output);

    // assert that initial content is correct
    const vm = render(template, options);
    expect(vm.$el.textContent).to.equal('hello static world');

    // update our state, and assert that the dom is changed
    vm.one = 'goodbye';
    vm.two.three = 'nothing';

    vm.$nextTick(() => {
        expect(vm.$el.textContent).to.equal('goodbye static nothing');
        done();
    });
});