describe('element with text', () => {
    const file = require('path').resolve(__dirname, 'Component.bia');

    it('renders', () => {
        // const { code } = compile(file);
        const vm = render(file, { el });

        expect(vm.$el.outerHTML).to.equal('<div>hello world</div>');
    });
});