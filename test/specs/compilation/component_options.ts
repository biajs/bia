import { code, expect, render } from '../../utils';

describe('component_options', () => {
    it('keeps a reference to data passed in through to constructor', function() {
        const vm = render(`
            <template>
                <div></div>
            </template>
        `, {
            foo: 'bar',
        });
        
        expect(vm.$options.foo).to.equal('bar');
    });
});