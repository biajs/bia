import { compile, expect, render } from '../../utils';

describe.only('stand alone if blocks', () => {  
    it('basic conditional node', function(done) {
        const source = `
            <template>
                <div>
                    <span b-if="foo">hello</span>
                </div>
            </template>
        `;

        // const output = compile(source);
        // console.log(output);

        const vm = render(source, {
            data: {
                foo: true,
            },
        });
        
        expect(vm.$el.outerHTML).to.equal(`<div><span>hello</span></div>`);

        vm.foo = false;
        vm.$nextTick(() => {
            expect(vm.$el.outerHTML).to.equal(`<div></div>`);
            done();
        });
    });
})