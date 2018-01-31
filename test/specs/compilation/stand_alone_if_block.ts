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

    it('sibling stand-alone if blocks', (done) => {
        const source = `
            <template>
                <div>
                    <p b-if="foo">foo</p>
                    <b b-if="bar">bar</b>
                    <i b-if="baz">baz</i>
                </div>
            </template>
        `;

        // const output = compile(source);
        // console.log(output);

        const vm = render(source, {
            data: {
                foo: false,
                bar: false,
                baz: false,
            },
        });

        expect(vm.$el.outerHTML).to.equal(`<div><!----><!----></div>`);

        vm.foo = true;
        vm.$nextTick(() => {
            expect(vm.$el.outerHTML).to.equal(`<div><p>foo</p><!----><!----></div>`);

            vm.bar = true;
            vm.$nextTick(() => {
                expect(vm.$el.outerHTML).to.equal(`<div><p>foo</p><!----><b>bar</b><!----></div>`);

                vm.baz = true;
                vm.$nextTick(() => {
                    expect(vm.$el.outerHTML).to.equal(`<div><p>foo</p><!----><b>bar</b><!----><i>baz</i></div>`);
                    done();
                });
            });
        })
    });

    it('sibling stand-alone if blocks between static content', (done) => {
        const source = `
            <template>
                <div>
                    <b>foo</b>
                    <i b-if="bar">bar</i>
                    <p b-if="baz">baz</p>
                    <s>yar</s>
                </div>
            </template>
        `;

        // const output = compile(source);
        // console.log(output);

        const vm = render(source, {
            data: {
                bar: false,
                baz: false,
            },
        });

        expect(vm.$el.outerHTML).to.equal(`<div><b>foo</b><!----><s>yar</s></div>`);

        vm.bar = true;
        vm.$nextTick(() => {
            expect(vm.$el.outerHTML).to.equal(`<div><b>foo</b><i>bar</i><!----><s>yar</s></div>`);

            vm.baz = true;
            vm.$nextTick(() => {
                expect(vm.$el.outerHTML).to.equal(`<div><b>foo</b><i>bar</i><!----><p>baz</p><s>yar</s></div>`);

                vm.bar = false;
                vm.$nextTick(() => {
                    expect(vm.$el.outerHTML).to.equal(`<div><b>foo</b><!----><p>baz</p><s>yar</s></div>`);

                    done();
                });
            });
        });
    });
});