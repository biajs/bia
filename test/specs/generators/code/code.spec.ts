import code from '../../../../src/generators/code/code';
import { expect } from '../../../utils';

describe.only('code generation', () => {

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
            }
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
});