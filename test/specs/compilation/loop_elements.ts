import { compile, expect, render } from '../../utils';

describe.only('loops', () => {
    it('renders elements in a loop', () => {
        const source = `
            <template>
                <div>
                    <p b-for="thing in things">hello</p>
                </div>
            </template>
        `;

        const output = compile(source);
        console.log(output);

        // const vm = render(source, {
        //     data: {
        //         things: ['foo', 'bar', 'baz'],
        //     },
        // });
    });
});