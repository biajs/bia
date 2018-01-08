import { compile, div, expect, render } from '../../../utils';

export default function(file) {
    it.only('component_options', () => {
        // const { code } = compile(file);
        // console.log(code);

        const el = div();
        const vm = render(file, { el, foo: 'bar' });
        
        expect(vm.$options).to.deep.equal({ el, foo: 'bar' });
    });
}