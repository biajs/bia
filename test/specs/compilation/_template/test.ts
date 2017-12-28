import { compile, div, expect, render } from '../../../utils';

export default function(file) {
    it.only('_template', () => {
        const { code } = compile(file);
        // const vm = render(file, { el: div() });

        console.log(code);
    });
}