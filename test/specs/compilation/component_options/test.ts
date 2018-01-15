import { compile, div, expect, render } from '../../../utils';

export default function(file) {
    it('component_options', function(done) {
        try {

            const { code } = compile(file);
            console.log(code);
            setTimeout(done, 1500);
        } catch(e) {
            console.log ('err', e);
            done();
        }

        // const el = div();
        // const vm = render(file, { el, foo: 'bar' });
        
        // expect(vm.$options).to.deep.equal({ el, foo: 'bar' });
    });
}