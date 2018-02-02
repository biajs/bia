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

    it('between static elements', (done) => {
        const source = `
            <template>
                <div>
                    <div>foo</div>
                    <div b-if="bar">bar</div>
                    <div b-else>baz</div>
                    <div>yar</div>
                </div>
            </template>
        `; 

        // const output = compile(source);
        // console.log(output);

        const vm = render(source, {
            data: {
                bar: true,
            },
        });

        expect(vm.$el.outerHTML).to.equal(`<div><div>foo</div><div>bar</div><div>yar</div></div>`);

        vm.bar = false;
        vm.$nextTick(() => {
            expect(vm.$el.outerHTML).to.equal(`<div><div>foo</div><div>baz</div><div>yar</div></div>`);
            done();
        });
    });

    it('between static text nodes', (done) => {
        const source = `
            <template>
                <div>
                    hello
                    <u b-if="foo">foo</u>
                    <s b-else>bar</s>
                    world
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

        expect(vm.$el.outerHTML).to.equal(`<div>hello <u>foo</u> world</div>`);

        vm.foo = false;
        vm.$nextTick(() => {
            expect(vm.$el.outerHTML).to.equal(`<div>hello <s>bar</s> world</div>`);
            done();
        });
    });

    it('sibling if/else blocks', (done) => {
        // block selectors need unique names
        const source = `
            <template>
                <div>
                    <p b-if="foo">foo</p>
                    <p b-else>bar</p>
                    <p b-if="baz">baz</p>
                    <p b-else>yar</p>
                </div>
            </template>
        `;

        // const output = compile(source);
        // console.log(output);

        const vm = render(source, {
            data: {
                foo: true,
                baz: true,
            },
        });

        expect(vm.$el.outerHTML).to.equal(`<div><p>foo</p><!----><p>baz</p></div>`);

        vm.foo = false;
        vm.$nextTick(() => {
            expect(vm.$el.outerHTML).to.equal(`<div><p>bar</p><!----><p>baz</p></div>`);

            vm.baz = false;
            vm.$nextTick(() => {
                expect(vm.$el.outerHTML).to.equal(`<div><p>bar</p><!----><p>yar</p></div>`);
                done();
            });
        });
    });

    it('sibling stand-alone if blocks', (done) => {
        const source = `
            <template>
                <div>
                    <s b-if="true">before</s>
                    <u b-if="foo">foo</u>
                    <i b-else>bar</i>
                    <b b-if="true">after</b>
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

        expect(vm.$el.outerHTML).to.equal(`<div><s>before</s><!----><u>foo</u><!----><b>after</b></div>`);

        vm.foo = false;
        vm.$nextTick(() => {
            expect(vm.$el.outerHTML).to.equal(`<div><s>before</s><!----><i>bar</i><!----><b>after</b></div>`);
            done();
        });
    });
});