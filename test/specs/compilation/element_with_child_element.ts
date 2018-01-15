import { code, expect, render } from '../../utils';

it('element_with_child_element', function() {
    const source = `
        <template>
            <div>
                <span>aloha</span>
            </div>
        </template>
    `;

    const options = {};

    // const output = code(source, options);
    // console.log(output);

    const vm = render(source, options);
    expect(vm.$el.innerHTML.trim()).to.equal('<span>aloha</span>');
});