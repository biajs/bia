import { code, expect, render } from '../../utils';

describe('component options', () => {
    it('component_options', function() {
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