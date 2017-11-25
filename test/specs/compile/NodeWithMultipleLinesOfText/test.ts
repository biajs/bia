import { expect } from 'chai';

export default function(NodeWithMultipleLinesOfText, code) {
    describe('NodeWithMultipleLinesOfText', () => {
        it('renders a node with text content', () => {
            const vm = new NodeWithMultipleLinesOfText({
                el: document.createElement('div'),
            });

            expect(vm._el.outerHTML).to.equal('<div>\r\n        Hello world\r\n        foo bar baz\r\n    </div>');
        });
    });
}