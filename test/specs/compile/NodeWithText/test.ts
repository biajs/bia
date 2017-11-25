import { expect } from 'chai';

export default function(NodeWithText, code) {
    describe('NodeWithText', () => {
        it('renders a node with text content', () => {
            const vm = new NodeWithText({
                el: document.createElement('div'),
            });

            expect(vm._el.outerHTML).to.equal('<div>Hello world</div>');
        });
    });
}