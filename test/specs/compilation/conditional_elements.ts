import { compile, expect, render } from '../../utils';

describe('conditional branches', () => {
    it('if / else branches', (done) => {
        const source = `
            <template>
                <div>
                    <p b-if="foo">foo</p>
                    <s b-else>bar</s>
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

        expect(vm.$el.outerHTML).to.equal(`<div><p>foo</p></div>`);

        vm.foo = false;
        vm.$nextTick(() => {
            expect(vm.$el.outerHTML).to.equal(`<div><s>bar</s></div>`);
            done();
        });
    });

    it('if / else-if / else branches', (done) => {
        const source = `
            <template>
                <div>
                    <p b-if="foo">foo</p>
                    <s b-else-if="bar">bar</s>
                    <u b-else>baz</u>
                </div>
            </template>
        `; 

        // const output = compile(source);
        // console.log(output);

        const vm = render(source, {
            data: {
                foo: true,
                bar: false,
            },
        });

        expect(vm.$el.outerHTML).to.equal(`<div><p>foo</p></div>`);

        vm.foo = false;
        vm.bar = true;
        vm.$nextTick(() => {
            expect(vm.$el.outerHTML).to.equal(`<div><s>bar</s></div>`);

            vm.bar = false;
            vm.$nextTick(() => {
                expect(vm.$el.outerHTML).to.equal(`<div><u>baz</u></div>`);
                done();
            });
        });
    });
});