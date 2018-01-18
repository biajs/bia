import code from '../../../../src/generators/code/code';
import { expect } from '../../../utils';

describe.skip('code generation', () => {

    it('can be cast to a string', () => {
        const output = code(`
            console.log('hello world');
        `);

        expect(String(output)).to.equal(`console.log('hello world');`);
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
        
        expect(output.toString()).to.equal(
            `function foo() {\n` +
            `    // hey\n` +
            `}\n` +
            `\n` +
            `function bar() {}\n` +
            `\n` +
            `function whatever() {\n` +
            `    foo();\n` +
            `    bar();\n` +
            `}`
        );
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

        expect(output.toString()).to.equal(
            `function foo() {\n` + 
            `    return 5;\n` +
            `}`
        );
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

        expect(output.toString()).to.equal(
            `function foo() {\n` + 
            `    return {\n` +
            `        foo: 'bar',\n` +
            `    };\n` +
            `}`
        );
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

        expect(output.toString()).to.equal(
            `function foo() {}\n` + 
            `foo(1, 2, 3);`
        );
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

        expect(output.toString()).to.equal(
            `function foo() {}\n` + 
            `foo(1, 2, 3);`
        );
    });

    it('code can be appended to a container', () => {
        const output = code(`
            // before

            :someContainer

            // after
        `);

        // output.append(`// foo`, 'someContainer');
        // output.append('// bar', 'someContainer');

        console.log('!!', output.toString(), '!!');

        // expect(output.toString()).to.equal(
        //     `// before\n` +
        //     `\n` +
        //     `// foo\n` +
        //     `\n` +
        //     `// bar\n` +
        //     `\n` +
        //     `// after`
        // )
    });
});