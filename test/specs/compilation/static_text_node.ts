import { code, expect, render } from '../../utils';

it('static_text_node', function() {
    // ignore the conditional node. it exists to force our text
    // to be instantiated as it's own dom node, rather than 
    // just setting via setText fn on the root element.
    const template = `
        <template>
            <div>
                hello world
                <div b-if="false"></div>
            </div>
        </template>
    `;

    const options = {};

    // const output = code(template, options);
    // console.log(output);

    const vm = render(template, options);
    expect(vm.$el.textContent).to.equal('hello world');
});