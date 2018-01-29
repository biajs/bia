import { compile, expect, render } from '../../utils';

describe.only('stand alone if blocks', () => {  
    it('basic conditional node', function() {
        const source = `
            <template>
                <div>
                    <span b-if="foo">hello</span>
                </div>
            </template>
        `;

        const output = compile(source);
        // console.log(output);

        const vm = render(source, {
            data: {
                foo: true,
            },
        });
        
        console.log(vm.$el.outerHTML);
    });
})