import { expect } from 'chai';

export default function(NodeWithQuotedText, code) {
    describe('NodeWithQuotedText', () => {
        it('renders a node with text content that contains quotes', () => {
            const vm = new NodeWithQuotedText({
                el: document.createElement('div'),
            });
            
            expect(vm._el.outerHTML).to.equal('<div>Foo\'s \"bar\"</div>');
        });
    });
}