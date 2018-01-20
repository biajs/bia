import Code from '../../../src/generators/code';
import { expect } from '../../utils';

describe('code generation', () => {
    it('can be cast to a string', () => {
        const output = new Code(`
            console.log('hello world');
        `);

        expect(output).to.equalCode(`
            console.log('hello world');
        `);
    });

    it('can reference helper functions', () => {
        const output = new Code(`
            :helpers

            function whatever() {
                @foo();
            }
        `, {
            helpers: {
                foo: `function foo() {}`,
            },
        });

        expect(output).to.equalCode(`
            function foo() {}

            function whatever() {
                foo();
            }
        `);
    });

    it('throws an error if a referenced helper was not found', () => {
        const output = new Code(`
            :helpers
            @foo(1, 2, 3);
        `);

        expect(() => output.toString()).to.throw(`Helper function "foo" not found.`);
    });

    it('renders static partials', () => {
        const output = new Code(`
            function foo() {
                return %whatever;
            }
        `, {
            partials: {
                whatever: `'hello'`
            },
        });

        expect(output).to.equalCode(`
            function foo() {
                return 'hello';
            }
        `);
    });

    it('renders dynamic partials', () => {
        const output = new Code(`
            function foo() {
                return %whatever;
            }
        `, {
            partials: {
                whatever() {
                    return `'world'`;
                },
            },
        });

        expect(output).to.equalCode(`
            function foo() {
                return 'world';
            }
        `);
    });

    it('renders partials at the correct indentation', () => {
        const output = new Code(`
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

    it('throws an error of a partial was not found', () => {
        const output = new Code(`
            %somePartial
        `);

        expect(() => output.toString()).to.throw(`Partial "somePartial" not found.`);
    });

    it('allows helpers to be used from static partials', () => {
        const output = new Code(`
            :helpers
            %foo
            %bar
        `, {
            helpers: {
                doStuff: `function doStuff() {}`,
            },
            partials: { 
                foo: `@doStuff('foo');`,
                bar: new Code(`@doStuff('bar');`),
            },
        });

        expect(output).to.equalCode(`
            function doStuff() {}
            doStuff('foo');
            doStuff('bar');
        `);
    });

    it('allows helpers to be used from dynamic partials', () => {
        const output = new Code(`
            :helpers
            %foo
            %bar
        `, {
            helpers: {
                doStuff: `function doStuff() {}`,
            },
            partials: {
                foo() {
                    return `@doStuff('foo');`;
                },
                bar() {
                    return new Code(`@doStuff('bar');`);
                },
            },
        });

        expect(output).to.equalCode(`
            function doStuff() {}
            doStuff('foo');
            doStuff('bar');
        `);
    });

    it('allows helpers to be used from deeply nested partials', () => {
        const output = new Code(`
            :helpers
            %child
        `, {
            helpers: {
                foo: `function foo() {}`,
            },
            partials: {
                child: new Code(`%grandchild`, {
                    partials: {
                        grandchild: `@foo(1, 2, 3);`
                    },
                }),
            },
        });

        expect(output).to.equalCode(`
            function foo() {}
            foo(1, 2, 3);
        `);
    });

    it('allows code to be appended to the original content', () => {
        const output = new Code(`
            // foo
        `);

        output.append(`// bar`);
        output.append(new Code(`// baz`));

        expect(output).to.equalCode(`
            // foo
            
            // bar

            // baz
        `);
    });
});