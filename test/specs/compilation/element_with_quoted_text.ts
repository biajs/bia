import { compile, expect, render } from '../../utils';

it('element_with_quoted_text', function() {
    const source = `
        <template>
            <div>
                one "two" 'three'
            </div>
        </template>
    `;

    // const output = compile(source);
    // console.log(output);

    const vm = render(source, {});
    expect(vm.$el.outerHTML).to.equal(`<div>one "two" 'three'</div>`);
});