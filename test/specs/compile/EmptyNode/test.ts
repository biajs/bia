export default function(EmptyNode) {
    describe.only('EmptyNode', () => {
        it('does stuff', () => {
            const vm = new EmptyNode({
                el: document.createElement('div'),
            });

            console.log (vm);
        });
    });
}