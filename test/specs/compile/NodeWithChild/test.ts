import { expect } from 'chai';

export default function(NodeWithChild, code) {
    describe('NodeWithChild', () => {
        it('renders child html', () => {
            const vm = new NodeWithChild({
                el: document.createElement('div'),
            });

            expect(vm._el.outerHTML).to.equal('<div>\n        <span>Aloha</span>\n    </div>')
        });
    });
}