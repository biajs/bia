describe('element with quoted text', () => {
    const file = require('path').resolve(__dirname, 'Component.bia');

    it('renders', () => {
        // const { code } = compile(file);
        const vm = render(file, { el });

        expect(vm.$el.textContent.trim()).to.equal(`testing "quoted" 'text'...`);
    });
});