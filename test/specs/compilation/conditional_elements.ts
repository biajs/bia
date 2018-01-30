import { compile, expect, render } from '../../utils';

describe.skip('conditional branches', () => {
    it('if / else branches', () => {
        const source = `
            <template>
                <div>
                    <p b-if="foo">foo</p>
                    <p b-else>bar</p>
                </div>
            </template>
        `; 

        const output = compile(source);
        console.log(output);
    });
});