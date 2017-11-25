import { expect } from 'chai';

export default function(NodeWithAttributes, code) {
    describe('NodeWithAttributes', () => {
        it('creates a dom element and hydrates it with attributes', () => {
            const vm = new NodeWithAttributes({
                el: document.createElement('div'),
            });

            expect(vm._el.outerHTML).to.equal('<div class="foo" style="color: red;"></div>');
        });
    });
}