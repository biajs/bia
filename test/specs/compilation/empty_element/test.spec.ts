describe('empty element', () => {
    const file = require('path').resolve(__dirname, 'Component.bia');

    it('renders', () => {
        const vm = render(file, { el });

        expect(vm.$el.outerHTML).to.equal('<div></div>');
    });
});