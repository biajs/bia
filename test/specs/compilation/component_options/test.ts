import { compile, div, expect, render } from '../../../utils';

export default function(file) {
    it('component_options', function() {
        const result = compile(file);
        console.log(result);

        // const el = div();
        // const vm = render(file, { el, foo: 'bar' });
        
        // expect(vm.$options).to.deep.equal({ el, foo: 'bar' });
    });
}