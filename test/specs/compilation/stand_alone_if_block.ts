import { compile, expect, render } from '../../utils';

describe('stand alone if blocks', () => {  
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

    it('static text before and after', (done) => {
        const source = `
            <template>
                <div>
                    before
                    <span b-if="middle">middle</span>
                    after
                </div>
            </template>
        `;

        // const output = compile(source);
        // console.log(output);

        const vm = render(source, {
            data: {
                middle: false,
            },
        });

        expect(vm.$el.outerHTML).to.equal('<div>before  after</div>');

        vm.middle = true;
        vm.$nextTick(() => {
            expect(vm.$el.outerHTML).to.equal('<div>before <span>middle</span> after</div>');
            done();
        });
    });

    it('static elements before and after', (done) => {
        const source = `
            <template>
                <div>
                    <b>before</b>
                    <i b-if="middle">middle</i>
                    <s>after</s>
                </div>
            </template>
        `;

        // const output = compile(source);
        // console.log(output);

        const vm = render(source, {
            data: {
                middle: false,
            },
        });

        expect(vm.$el.outerHTML).to.equal(`<div><b>before</b><s>after</s></div>`);

        vm.middle = true;
        vm.$nextTick(() => {
            expect(vm.$el.outerHTML).to.equal(`<div><b>before</b><i>middle</i><s>after</s></div>`);
            done();
        });
    });
});