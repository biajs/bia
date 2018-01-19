import code from '../../../../src/generators/code/code';
import { expect } from '../../../utils';

describe('code generation', () => {

    it('can be cast to a string', () => {
        const output = code(`
            console.log('hello world');
        `);

        expect(output).to.equalCode(`
            console.log('hello world');
        `);
    });

    it('can reference helper functions', () => {
        const output = code(`
            :helpers
            
            function whatever() {
                @foo();
                @bar();
            }
        `, {
            helpers: {
                foo: `
                    function foo() {
                        // hey
                    }
                `,
                bar: `function bar() {}`,
            },
        });
        
        expect(output).to.equalCode(`
            function foo() {
                // hey
            }

            function bar() {}

            function whatever() {
                foo();
                bar();
            }
        `);
    });

    it('throws an error if a referenced helper was not found', () => {
        const output = code(`
            :helpers
            @foo(1, 2, 3);
        `);

        expect(() => output.toString()).to.throw(`Helper function "foo" not found.`);
    });

    it('renders partials', () => {
        const output = code(`
            function foo() {
                return %whatever;
            }
        `, {
            partials: {
                whatever: `5`
            },
        });

        expect(output).to.equalCode(`
            function foo() {
                return 5;
            }
        `);
    });

    it('renders partials at the correct indentation', () => {
        const output = code(`
            function foo() {
                return %whatever;
            }
        `, {
            partials: {
                whatever: `
                    {
                        foo: 'bar',
                    }
                `,
            },
        });

        expect(output).to.equalCode(`
            function foo() {
                return {
                    foo: 'bar',
                };
            }
        `);
    });

    it('allows helpers to be used from partials', () => {
        const output = code(`
            :helpers
            %child
        `, {
            partials: { 
                child: code(`@foo(1, 2, 3);`),
            },
            helpers: {
                foo: `function foo() {}`,
            },
        });

        expect(output).to.equalCode(`
            function foo() {}
            foo(1, 2, 3);
        `);
    });

    it('allows helpers to be used from deeply nested partials', () => {
        const output = code(`
            :helpers
            %child
        `, {
            helpers: {
                foo: `function foo() {}`,
            },
            partials: {
                child: code(`%grandchild`, {
                    partials: {
                        grandchild: `@foo(1, 2, 3);`
                    }
                }),
            }
        });

        expect(output).to.equalCode(`
            function foo() {}
            foo(1, 2, 3);
        `);
    });

    it('code can be appended to other code', () => {
        const output = code(`
            // foo
        `);

        output.append('// bar');
        output.append('// baz');

        expect(output).to.equalCode(`
            // foo
            
            // bar
            
            // baz
        `);
    });

    it('appended code can use helpers', () => {
        const output = code(`
            :helpers
        `, {
            helpers: {
                foo: `function foo() {}`,
            },
        });

        output.append(`@foo(1, 2, 3);`);

        expect(output.toString()).to.equalCode(`
            function foo() {}
            
            foo(1, 2, 3);
        `);
    });

    it('code can be appended to a container', () => {
        const output = code(`
            // before

            :someContainer

            // after
        `);

        output.append(`// foo`, 'someContainer');
        output.append('// bar', 'someContainer');

        expect(output).to.equalCode(`
            // before

            // foo
            
            // bar

            // after
        `);
    });

    it('can append child code objects to containers', () => {
        const parent = code(`
            :foo
        `);

        const child = code(`
            // hello from the child
        `);

        parent.append(child, 'foo');

        expect(child.parent).to.equal(parent);
        expect(parent).to.equalCode(`// hello from the child`);
    })

    it('removes unused containers', () => {
        const output = code(`
            function foo() {
                :vars
                return null;
            }
        `);

        expect(output).to.equalCode(`
            function foo() {

                return null;
            }
        `);
    });

    it('exposes a computed "root" property', () => {
        const foo = code(`:foo`);
        const bar = code(`:bar`);
        const baz = code(`// hello from baz`);

        bar.append(baz, 'bar');
        expect(baz.root).to.equal(bar);

        foo.append(bar, 'foo');
        expect(baz.root).to.equal(foo);
    });
});