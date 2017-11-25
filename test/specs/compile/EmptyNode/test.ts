import { expect } from 'chai';

export default function(EmptyNode, code) {
    describe('EmptyNode', () => {
        it('renders an empty node', () => {
            const vm = new EmptyNode({
                el: document.createElement('div'),
            });

            expect(vm._el.outerHTML).to.equal('<div></div>');
        });
    });
}